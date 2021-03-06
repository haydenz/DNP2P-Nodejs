var PRIVATE_KEY_PATH = 'store/pri_key.dat';
var PUBLIC_KEY_PATH = 'store/pub_key.dat';
const KEY_BITS = 512;
const ENCRYPTE_ENCODE = 'base64';

var NodeRSA = require('node-rsa');
var fs = require('fs');

function RsaKey (){
	this.key = loadKey();
}

RsaKey.prototype.sign = function(message){
	var sign = this.key.sign(message,ENCRYPTE_ENCODE);
	return sign;
}

RsaKey.prototype.verifyExternal = function(mes, sig, pub_key_str){
	var temp_key = new NodeRSA();
	temp_key.importKey(pub_key_str);
	return temp_key.verify(mes,sig,'buffer',ENCRYPTE_ENCODE);
}

RsaKey.prototype.getPubKey = function(){
	var key_str =  this.key.exportKey('pkcs1-public-pem');
	return key_str;
}

function loadKey (){
	console.log('[RSA] Loading Keys');
	try{
		var pri_key_str = fs.readFileSync(PRIVATE_KEY_PATH);
		var key = new NodeRSA(pri_key_str);
		var pub_key_str = fs.readFileSync(PUBLIC_KEY_PATH);
		key.importKey(pub_key_str,'pkcs1-public');
	}catch (err){
		console.log('[RSA] Loading keys failed. Using new identity.')
		var key = generateKeyPair();
	}
	return key;
}

function generateKeyPair(){
	var key = new NodeRSA({b:KEY_BITS});
	var private_der = key.exportKey('pkcs1-private-pem');
	var public_der = key.exportKey('pkcs1-public-pem');
	fs.writeFileSync(PRIVATE_KEY_PATH, private_der);
	fs.writeFileSync(PUBLIC_KEY_PATH, public_der);
	return key;
}

module.exports = RsaKey;