module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userid

  if (!userId) {
    res.redirect('/login')
  }

  next()
}

module.exports.checkAuthAdmin = function(req, res, next){
  const admin = req.session.admin
  
  if(admin == false){
    res.redirect('/')
  }

  next()
}
