#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Building Lambda Layers..."

# Sharp Layer
echo "Building Sharp Layer..."
mkdir -p "$SCRIPT_DIR/sharp-layer/nodejs"
cd "$SCRIPT_DIR/sharp-layer/nodejs"

# package.jsonを作成
cat > package.json <<EOF
{
  "name": "sharp-layer",
  "version": "1.0.0",
  "dependencies": {
    "sharp": "0.32.6"
  }
}
EOF

# Linux向けにビルド（Lambda実行環境に合わせる）
npm install --arch=x64 --platform=linux --target=18.0.0 sharp

cd ..
zip -r sharp-layer.zip nodejs
rm -rf nodejs
mv sharp-layer.zip ../

echo "Sharp Layer built successfully!"

# FFmpeg Layer
echo "Building FFmpeg Layer..."
mkdir -p "$SCRIPT_DIR/ffmpeg-layer/bin"
cd "$SCRIPT_DIR/ffmpeg-layer"

# FFmpegのダウンロード（Lambda用の静的ビルド）
if [ ! -f bin/ffmpeg ]; then
  echo "Downloading FFmpeg..."
  # John Van Sickleの静的ビルドを使用
  curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
  tar -xf ffmpeg.tar.xz
  mv ffmpeg-*-amd64-static/ffmpeg bin/
  rm -rf ffmpeg-*-amd64-static ffmpeg.tar.xz
  chmod +x bin/ffmpeg
fi

zip -r ffmpeg-layer.zip bin
mv ffmpeg-layer.zip ../
echo "FFmpeg Layer built successfully!"

echo "All layers built successfully!"