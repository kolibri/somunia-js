# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = 'geerlingguy/ubuntu1604'
    config.vm.network 'private_network', ip: '192.168.50.57'
    config.vm.host_name = 'somunia-js.dev'
    
    config.vm.synced_folder '.', '/srv/share', id: 'vagrant-share', :nfs => true

    config.vm.provision 'ansible_local' do |ansible|
        ansible.provisioning_path = '/srv/share/ansible'
        ansible.playbook          = 'devbox.yml'
    end
end
