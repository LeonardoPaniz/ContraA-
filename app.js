const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path')
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 2000;

app.listen(PORT, function(){
   console.log(`Estamos rodando na porta ${PORT}`); 
})

//*Body Parser
app.use(bodyParser.urlencoded({extended:false}));

//* Handle Bars
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

//* Static folder
app.use(express.static(path.join(__dirname, 'public')))

//* DB connection
db
.authenticate()
.then(() =>{
    console.log('Conectou ao banco com sucesso');
})
.catch(err => {
    console.log('Não foi possivel haver conexão ao DataBase', err);
})

//* Routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+"%";

    if(!search){
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render(`index`,{
                jobs
            });
        })
        .catch(err => console.log(err));
    }else{
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render(`index`,{
                jobs, search
            });
        })
        .catch(err => console.log(err));
    };
});

app.use('/jobs', require('./routes/jobs'))