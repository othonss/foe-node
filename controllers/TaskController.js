const Task = require('../models/Task')
const User = require('../models/User')
const moment = require('moment')

const { Op } = require('sequelize')

module.exports = class TaskController {
  static async dashboard(req, res) {
    const userId = req.session.userid

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Task,
      plain: true,
    })

    const tasks = user.Tasks.map((result) => result.dataValues)


    let emptyTasks = true

    if (tasks.length > 0) {
      emptyTasks = false
    }

    console.log(tasks)
    console.log(emptyTasks)

    res.render('tasks/dashboard', { tasks, emptyTasks })
  }

  static createTask(req, res) {
    res.render('tasks/create')
  }

  static createTaskSave(req, res) {
    const task = {
      title: req.body.title,
      description: req.body.description,
      UserId: req.session.userid,
    }

    Task.create(task)
      .then(() => {
        req.flash('message', 'Tarefa criada com sucesso!')
        req.session.save(() => {
          res.redirect('/tasks/dashboard')
        })
      })
      .catch((err) => console.log())
  }

  static async showTasks(req, res) {
    console.log(req.query)

    // check if user is searching
    let search = ''

    if (req.query.search) {
      search = req.query.search
    }

    // order results, newest first
    let order = 'DESC'

    if (req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }

    Task.findAll({
      include: User,
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      order: [['updatedAt', order]],
    })
      .then((data) => {
        let tasksQty = data.length

        if (tasksQty === 0) {
          tasksQty = false
        }
        
        const tasks = data.map((result) => {
          const formattedUpdateddAtData = moment(result.updatedAt).format('DD/MM/YYYY [às] HH:mm') 
          return {
            ...result.get({plain: true }),
            updatedAt: formattedUpdateddAtData,
          }
        })

        res.render('tasks/home', { tasks, tasksQty, search})
      })
      .catch((err) => console.log(err))

      

  }

  static removeTask(req, res) {
    const id = req.body.id

    Task.destroy({ where: { id: id } })
      .then(() => {
        req.flash('message', 'Tarefa removida com sucesso!')
        req.session.save(() => {
          res.redirect('/tasks/dashboard')
        })
      })
      .catch((err) => console.log())
  }

  static updateTask(req, res) {
    const id = req.params.id

    Task.findOne({ where: { id: id }, raw: true })
      .then((task) => {
        res.render('tasks/edit', { task })
      })
      .catch((err) => console.log())
  }

  static updateTaskPost(req, res) {
    const id = req.body.id

    const task = {
      title: req.body.title,
      description: req.body.description,
    }

    Task.update(task, { where: { id: id } })
      .then(() => {
        req.flash('message', 'Tarefa atualizada com sucesso!')
        req.session.save(() => {
          res.redirect('/tasks/dashboard')
        })
      })
      .catch((err) => console.log())
  }
}
