
# A simple ansible with docker test.

#### Start a container.

```
docker run --name coffeemaker -d -it ubuntu:16.04 /bin/bash
```

#### Create a simple inventory file.

```
coffeemaker ansible_connection=docker
```

#### Install sudo and python-minimal
ansible-playbook -i sut/inventory playbooks/bootstrap.yml

#### Now you can run normal ansible!
ansible-playbook -i sut/inventory playbooks/simple.yml
