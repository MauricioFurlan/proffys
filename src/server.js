const nunjucks = require('nunjucks')
const express = require('express');
const server = express();
//config nunjucks - poderes para add dados do backand para o frontand
nunjucks.configure('src/views', {
    express: server,
    noCache: true
});
  const {pageLanding, pageStudy, pageGiveClasses, saveClasses} = require('./pages')

//configurar arquivos estaticos css/imagens/scripts
server.use(express.urlencoded({extended: true}))
.use(express.static("public"))

//rotas da app
.get('/', pageLanding)
.get('/study', pageStudy)
.get('/give-classes', pageGiveClasses)
.post('/save-classes', saveClasses)
.listen(process.env.PORT || 5500);