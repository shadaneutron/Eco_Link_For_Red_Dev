import os
import io
import zipfile
import torch
import torch.nn as nn

# PyTorch EfficientNet-B0 architecture matching trained state_dict
class SqueezeExcitation(nn.Module):
    def __init__(self, input_channels: int, squeeze_channels: int):
        super().__init__()
        self.fc1 = nn.Conv2d(input_channels, squeeze_channels, 1)
        self.fc2 = nn.Conv2d(squeeze_channels, input_channels, 1)
        self.activation = nn.SiLU()
        self.scale_activation = nn.Sigmoid()

    def forward(self, input: torch.Tensor) -> torch.Tensor:
        scale = input.mean((2, 3), keepdim=True)
        scale = self.fc1(scale)
        scale = self.activation(scale)
        scale = self.fc2(scale)
        scale = self.scale_activation(scale)
        return input * scale


class MBConvConfig:
    def __init__(self, expand_ratio: float, kernel: int, stride: int, input_channels: int, out_channels: int, num_layers: int):
        self.expand_ratio = expand_ratio
        self.kernel = kernel
        self.stride = stride
        self.input_channels = input_channels
        self.out_channels = out_channels
        self.num_layers = num_layers


class MBConv(nn.Module):
    def __init__(self, cnf: MBConvConfig, norm_layer=nn.BatchNorm2d):
        super().__init__()
        expanded_channels = int(round(cnf.input_channels * cnf.expand_ratio))
        layers = []
        if expanded_channels != cnf.input_channels:
            layers.append(nn.Sequential(
                nn.Conv2d(cnf.input_channels, expanded_channels, 1, bias=False),
                norm_layer(expanded_channels),
                nn.SiLU()
            ))
        padding = (cnf.kernel - 1) // 2
        layers.append(nn.Sequential(
            nn.Conv2d(expanded_channels, expanded_channels, cnf.kernel, cnf.stride, padding, groups=expanded_channels, bias=False),
            norm_layer(expanded_channels),
            nn.SiLU()
        ))
        squeeze_channels = max(1, int(cnf.input_channels * 0.25))
        layers.append(SqueezeExcitation(expanded_channels, squeeze_channels))
        layers.append(nn.Sequential(
            nn.Conv2d(expanded_channels, cnf.out_channels, 1, bias=False),
            norm_layer(cnf.out_channels)
        ))
        self.block = nn.Sequential(*layers)
        self.use_res_connect = cnf.stride == 1 and cnf.input_channels == cnf.out_channels

    def forward(self, x):
        res = self.block(x)
        if self.use_res_connect:
            res = res + x
        return res


class EfficientNetB0(nn.Module):
    def __init__(self, num_classes=6):
        super().__init__()
        self.features = nn.Sequential()
        self.features.add_module('0', nn.Sequential(
            nn.Conv2d(3, 32, 3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.SiLU()
        ))
        b_idx = 1
        configs = [
            MBConvConfig(1, 3, 1, 32, 16, 1),
            MBConvConfig(6, 3, 2, 16, 24, 2),
            MBConvConfig(6, 5, 2, 24, 40, 2),
            MBConvConfig(6, 3, 2, 40, 80, 3),
            MBConvConfig(6, 5, 1, 80, 112, 3),
            MBConvConfig(6, 5, 2, 112, 192, 4),
            MBConvConfig(6, 3, 1, 192, 320, 1),
        ]
        for cnf in configs:
            stage = nn.Sequential()
            for l_idx in range(cnf.num_layers):
                stage_cnf = MBConvConfig(
                    cnf.expand_ratio, cnf.kernel,
                    cnf.stride if l_idx == 0 else 1,
                    cnf.input_channels if l_idx == 0 else cnf.out_channels,
                    cnf.out_channels, 1
                )
                stage.add_module(str(l_idx), MBConv(stage_cnf))
            self.features.add_module(str(b_idx), stage)
            b_idx += 1
        self.features.add_module(str(b_idx), nn.Sequential(
            nn.Conv2d(320, 1280, 1, bias=False),
            nn.BatchNorm2d(1280),
            nn.SiLU()
        ))
        self.avgpool = nn.AdaptiveAvgPool2d(1)
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(1280, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x


def load_model(weights_dir=None):
    if weights_dir is None:
        ai_dir = os.path.dirname(os.path.abspath(__file__))
        weights_dir = os.path.join(ai_dir, 'model_weights')
        
    if not os.path.exists(weights_dir):
        raise FileNotFoundError(f"Model weights directory not found at {weights_dir}")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_STORED) as zf:
        for root, dirs, files in os.walk(weights_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, weights_dir)
                arcname = os.path.join('archive', rel_path)
                zf.write(full_path, arcname)

    buf.seek(0)
    state_dict = torch.load(buf, map_location='cpu', weights_only=False)

    model = EfficientNetB0(num_classes=6)
    model.load_state_dict(state_dict)
    model.eval()
    return model
