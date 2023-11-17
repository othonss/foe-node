const User = require('../models/User')
const moment = require('moment')
const bcrypt = require('bcryptjs')


module.exports = class UserController {
  static login(req, res) {
    res.render('auth/login')
  }

  static async loginPost(req, res) {
    const { identification, password } = req.body

    // find user
    const user = await User.findOne({ where: { identification: identification } })

    if (!user) {
      res.render('auth/login', {
        message: 'Usuário não encontrado!',
      })

      return
    }

    // compare password
    const passwordMatch = bcrypt.compareSync(password, user.password)

    if (!passwordMatch) {
      res.render('auth/login', {
        message: 'Senha inválida!',
      })

      return
    }

    // auth user
    req.session.userid = user.id
    req.session.userName = user.name

    if(req.session.userid == 1){
      req.session.admin = true
    }else{
      req.session.admin = false
    }

    req.flash('message', 'Login realizado com sucesso!')

    req.session.save(() => {
      res.redirect('/')
    })
  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const { name, identification, password, confirmpassword } = req.body

    // passwords match validation
    if (password != confirmpassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!')
      res.render('auth/register')

      return
    }

    // identification validation
    const checkIfUserExists = await User.findOne({ where: { identification: identification } })

    if (checkIfUserExists) {
      req.flash('message', 'Esse identificador já está cadastrado!')
      res.render('auth/register')

      return
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const user = {
      name,
      identification,
      password: hashedPassword,
    }

    User.create(user)
      .then((user) => {
        //initialize session
        //req.session.userid = user.id

        // console.log('salvou dado')
        // console.log(req.session.userid)

        req.flash('message', 'Colaborador(a) cadastrado com sucesso!')
        //console.log("O que tem na sessao admin?" + req.session.admin)

        req.session.save(() => {
          res.redirect('/users')
       })
      })
      .catch((err) => console.log(err))
      console.log("Não estou aqui")
  }

  static async users(req, res) {
    User.findAll({ raw: false }) // Remova a opção raw: true para obter instâncias de modelo
      .then((data) => {
        let emptyUsers = false;
        let onlyAdmin = false;
  
        if (data.length === 0) {
          emptyUsers = true;
        } else if (req.session.admin && data.every(user => user.isAdmin)) {
          onlyAdmin = true;
        }

  
        const usersDate = data.map((result) => {
          const formattedUpdateddAtData = moment(result.updatedAt).format('DD/MM/YYYY [às] HH:mm');
          return {
            ...result.get({ plain: true }),
            updatedAt: formattedUpdateddAtData,
          };
        });
  
        res.render('users/user', { users: data, emptyUsers, onlyAdmin, usersDate });
      })
      .catch((err) => console.log(err));
  }


  static async removeUser(req, res){
    console.log("Estou aqui no remove")
    const identification = req.body.identification
    console.log("Qual é o identificador: " + identification)
    User.destroy({ where: { identification: identification } })
      .then(() => {
        req.flash('message', 'Colaborador excluído com sucesso!')
        req.session.save(() => {
          res.redirect('/users')
        })
      })
      .catch((err) => console.log())
  }

  static logout(req, res) {
    req.session.destroy()
    res.redirect('/login')
  }
}
