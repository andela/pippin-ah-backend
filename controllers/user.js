import models from '../models';
import passport from 'passport';
import bcrypt from 'bcryptjs';

const User = models.user;

class Users{
    static  getUser(req, res) {
        User.findById(req.params.userId)
            .then((user) => {
            if (!user) {
                return res.status(404).json({
                  message: 'User Not Found'
                });
              }
              return res.status(200).json({
                message: 'User Found',
                user
              });
            })
            .catch(error => res.status(400).send(error));
    }

    static updateUser(req, res) {
        User.findById(req.params.userId)
            .then((user) =>{
                if (!user) {
                    return res.status(404).json({
                        message: 'User Not Found'
                      });
                    }
                
                return User
                .update({
                  username: req.body.username,
                  email: req.body.email,
                  password:req.body.password
                })
                .then(updatedUser => res.status(200).json({
                  updatedUser,
                  message: 'User Has been updated'
                }))
                .catch(error => res.status(400).send(error));
            }) 
    }

    static login(req, res) {
        passport.authenticate("local", { session: false }, function(
            err,
            user,
            info
        ) {
            if (err) {
                return next(err);
            }
    
            if (user) {
                return res.json({ message :'Login was successful' });
            } else {
                return res.status(401).json('incorrect email or password');
            }
        });
    }

    static register(req, res) {
            const password = bcrypt.hashSync(req.body.password, 10);
        
            return User
              .create({
                username: req.body.username,
                email: req.body.email,
                password
            
              })
              .then(user => res.status(201).send({ 
                message: 'Your Registration sucessful',
                username: user.username,
                email: user.email
              }))
              .catch(error => res.status(400).send({ message: 'Email or Username Already in Use'
              }));
          }
        

  
}
export default Users;