const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.get('/', ticketController.getAllTickets);

router.post('/', ticketController.createTicket);

router.get('/user/:userId', ticketController.getUserTickets);

router.put('/:id', ticketController.updateTicket);

router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
