const {host, port, app, urlencodedParser, session, login, password} = require('./config')
const {Select, Edit,Update, SelectWhere, Delete, Insert, pool} = require('./db')
const {generateKey} = require('./utils')

app.get('/', async (req, res) => {
    var data = await Select()
    res.render('index.ejs', {data: data, login: req.session.login})
})


app.get('/news/:id', async (req, res) => {
    var data = await SelectWhere(req.params.id)
    Update(req.params.id)
    res.render('product.ejs', {data: data, login: req.session.login})
})

app.get('/edit/:id', async (req, res) => {
    if (req.session.login) {
        var data = await SelectWhere(req.params.id)
        res.render('edit.ejs', {data: data, login: req.session.login})
    } 
})

app.post('/edit/:id', urlencodedParser,async (req, res) => {
    var photo = req.body.photo
    var name = req.body.name
    var description = req.body.description
    Edit(name, description, photo, req.params.id)
    res.redirect('/')
})

app.get('/delete/:id', async (req, res) => {
    if (req.session.login) {
        var data = await Delete(req.params.id)
        res.redirect('/')
    }
})

app.get('/sign/', (req, res) => {
    res.render('sign.ejs', {login: req.session.login})
})

app.get('/new_post/', (req, res) => {
    res.render('new_post.ejs', {login: req.session.login})
})

app.post('/new_post/', (req, res) => {
    var photo = req.body.photo
    var name = req.body.name
    var description = req.body.description
    var url = generateKey()
    var now = new Date();
    if (String(now.getMonth()).length < 10) {
        var getMonth = '0'+String(now.getMonth()+1);
    } else {
        var getMonth = now.getMonth()+1;
    }

    if (String(now.getDate()).length < 10) {
        var getDate = '0'+String(now.getDate());
    } else {
        var getDate = now.getDate();
    }

    var getFullYear = now.getFullYear();

    var FullData = `${getDate}-${getMonth}-${getFullYear}`

    if (!name || !description || !photo) {
        res.render('new_post.ejs', {login: req.session.login})   
    } else {
        Insert(name, description, photo, url, FullData)
        res.redirect('/')
    }
})

app.post('/sign/', urlencodedParser, (req, res) => {
    var login_ = req.body.login_
    var password_ = req.body.password_
    if (!login || !password_) {
        res.render('sign.ejs', {login: req.session.login})
    } 
    if (login_ == login && password == password_) {
        req.session.login = login;
        res.redirect('/')
    } else {
        res.render('sign.ejs')
    }
})

app.get('/losses/', async (req, res) => {

    var now = new Date();
    if (String(now.getMonth()).length < 10) {
        var getMonth = '0'+String(now.getMonth()+1);
    } else {
        var getMonth = now.getMonth()+1;
    }

    if (String(now.getDate()).length < 10) {
        var getDate = '0'+String(now.getDate());
    } else {
        var getDate = now.getDate();
    }

    var getFullYear = now.getFullYear();

    try {
        const response = await (await fetch(`https://russianwarship.rip/api/v2/statistics/${getFullYear}-${getMonth}-${getDate}`)).json();
        var ru_loss_info = response['data']['stats']
    } catch {
        const response = await (await fetch(`https://russianwarship.rip/api/v2/statistics/${getFullYear}-${getMonth}-${String('0'+String(getDate-1))}`)).json();
        var ru_loss_info = response['data']['stats']
    }
    res.render('losses.ejs', {
        getMonth: getMonth, 
        getDate:  getDate,
        personnel_units: ru_loss_info.personnel_units,
        tanks: ru_loss_info.tanks,
        armoured_fighting_vehicles: ru_loss_info.armoured_fighting_vehicles,
        artillery_systems: ru_loss_info.artillery_systems,
        mlrs: ru_loss_info.mlrs,
        aa_warfare_systems: ru_loss_info.aa_warfare_systems,
        planes: ru_loss_info.planes,
        helicopters: ru_loss_info.helicopters,
        vehicles_fuel_tanks: ru_loss_info.vehicles_fuel_tanks,
        warships_cutters: ru_loss_info.warships_cutters,
        cruise_missiles: ru_loss_info.cruise_missiles,
        uav_systems: ru_loss_info.uav_systems,
        special_military_equip: ru_loss_info.special_military_equip,
        atgm_srbm_systems: ru_loss_info.atgm_srbm_systems,
        login: req.session.login
    })
})

app.listen(port, host) 