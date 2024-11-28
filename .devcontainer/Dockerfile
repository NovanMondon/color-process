FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

RUN set -x \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

USER vscode

# install bun
RUN sudo curl https://bun.sh/install | bash \
    && bash -c "source /home/vscode/.bashrc"
