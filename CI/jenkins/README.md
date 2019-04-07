To install galaxy roles run:
``` bash
ansible-galaxy install -r requirements.yml -p roles
```

To configure server using ansible roles run:
``` bash
ansible-playbook -i inventory playbook.yml
```