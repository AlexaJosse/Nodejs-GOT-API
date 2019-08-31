const express = require('express');
const Router = express.Router();
const Character = require('../models/character');

// GET Request
// '/characters'
// retrieve all characters
Router.get('/', (req, res, next) => {
  Character.find({})
    .select("firstName lastName")
    .exec((err, characters) => {
      if (err) {
        next(err);
      } else {
        var charactersObject = {};
        characters.forEach((character) => {
          charactersObject[character.id] = character.firstName + " " + character.lastName
        });
        res.status(200).json(charactersObject);
      };
    });
});

// GET Request
// '/characters/:id'
// retrieve a character
Router.get('/:id',
  (req, res, next) => {
    var id = req.params.id;
    Character.findById(id)
      .exec((err, character) => {
        if (err && err.name === "CastError") {
          res.status(404).json({
            message: "No character with this id."
          })
        } else if (err) {
          next(err);
        } else {
          res.status(200).json({
            id: character.id,
            firstName: character.firstName,
            lastName: character.lastName,
            deathSeason: character.deathSeason
          });
        }
      });
  });

// POST Request
// '/characters'
// create a character
Router.post('/', (req, res, next) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  if (!firstName || !lastName) {
    res.status(422).json({
      message: 'missing parameters'
    });
  } else {
    Character.findOne({
        firstName: firstName,
        lastName: lastName
      })
      .exec((err, character) => {
        if (err) {
          next(err);
        } else if (character) {
          res.status(409).json({
            message: 'Character already exists'
          })
        } else {
          let character = new Character({
            firstName: firstName,
            lastName: lastName
          });

          character.save((err, character) => {
            if (err) {
              next(err);
            } else {
              res.status(201).json({
                message: 'Character created',
                characterId: character.id
              })
            }
          })
        }
      });
  }
});

// DELETE Request
// '/characters/:id'
// delete a character
Router.delete('/:id', (req, res, next) => {
  var id = req.params.id;
  Character.findByIdAndRemove(id)
    .exec((err, character) => {
      if (err && err.name === 'CastError') {
          res.status(404).json({
            message: "No character with this id"
          });
        } else if(err){
          next(err);
      } else {
        res.status(200).json({
          'message': 'Character deleted',
          'id': id,
          'character':character
        });
      }
    });
});

module.exports = Router;
