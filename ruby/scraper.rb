require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'openssl'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

url = 'https://www.gofundme.com/mvc.php?route=search&page=2&term=76134'
proxyIP
proxyPort

doc = Nokogiri::HTML(open(url, :proxy =>"#{proxy_IP}:#{proxyPort}"))

puts doc
