echo "==================Update apt-get================================"
sudo apt update
sudo apt install net-tools
echo "====================End of Updating apt-get========================="

echo "==================Install Apache2================================"
sudo apt install -y apache2
sudo a2enmod rewrite # enable rewrite engine
sudo cp /vagrant/vagrant-provision/vhost.conf /etc/apache2/sites-available/angular.conf
sudo cp /etc/apache2/apache2.conf /etc/apache2/apache2.conf.orig
sudo cp /vagrant/vagrant-provision/apache2.conf /etc/apache2/apache2.conf
sudo cp /vagrant/vagrant-provision/ports.conf /etc/apache2/ports.conf
sudo mkdir /var/log/apache2/angular
sudo a2ensite angular.conf
sudo a2dissite 000-default.conf
sudo systemctl restart apache2
echo "====================End of Apache2 installation========================="

echo "==================Install NodeJS and NPM================================"
sudo apt install -y nodejs npm
# nodejs version manager
sudo npm install -g n
sudo n stable
# remove everything related to packages
sudo apt purge -y nodejs npm
sudo npm install
echo "==================End of NodeJS and NPM Installation==========================="