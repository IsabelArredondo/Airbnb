
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Image, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();



// find allSpots 
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: {
      model: Image,
      as: 'previewImage',
      attributes: ['url']
    }
  });

  res.json(spots);
})

//find all spots by id 
router.get('/:id(\\d+)', async (req, res) => {
  const spots = await Spot.findByPk(req.params.id, {
    include: [
      {
        model: Image,
        as: 'images',
        attributes: ['url']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
  });

  if (!spots) {
    res.status(404)
    res.json({ message: "Spot couldn't be found", statusCode: 404 })
  }

  res.json({ spots })
})

// get all spots based on user id 
router.get('/userSpots', requireAuth, async (req, res) => {
  const { id } = req.user
  console.log(id)
  const places = await Spot.findAll({
    include: {
      model: Image,
      as: 'previewImage',
      attributes: ['url']
    },
    where: { ownerId: id }
  });
  res.json(places[0])
});

const validateSpots = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

//post newSpot
router.post('/', validateSpots, requireAuth, async (req, res) => {
  let { address, city, state, country, lat, lng, name, description, price } = req.body

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })

  res.json({ message: 'Successfully created spot', newSpot })
})

//put spot 
router.put('/:ownerId', validateSpots, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const spots = await Spot.findOne(

    {
      where: {
        ownerId: req.params.ownerId
      }
    }
  );
// both equal 1
//console.log(req.params.ownerId)

  if (!spots || spots.ownerId !== req.user.id) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found", 
      statusCode: 404
    })
  }
  
  spots.address = address
  spots.city = city
  spots.state = state
  spots.country = country
  spots.lat = lat
  spots.lng = lng
  spots.name = name
  spots.description = description
  spots.price = price

  await spots.save()
  return res.json(spots)
})



//delete spot 
router.delete('/:id', requireAuth, async (req, res) => {

  const spots = await Spot.findByPk(req.params.id);

  if (!spots || spots.ownerId !== req.user.id) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found", 
      statusCode: 404
    })
  }

  spots.destroy()
  spots.save()

  res.json({
    message: "Successfully deleted",
    statusCode: 200
  })
  
})






















module.exports = router