FROM ubuntu:16.04

RUN apt-get update && apt-get install -y sudo
RUN test -e /usr/bin/python || (apt -y update && sudo apt install -y python-minimal)
RUN apt-get update && apt-get install -y python-pip apt-transport-https

RUN useradd -ms /bin/bash ubuntu && passwd -d ubuntu
# RUN usermod -aG sudo ubuntu
RUN adduser ubuntu sudo
USER ubuntu
WORKDIR /home/ubuntu

