import React, { useState } from 'react';
import AuthenticationForm from './AuthenticationForm';
import { collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import firestore from './firebase';

const TicketTable = ({ tickets, buyTicket, removeTicket }) => {
const [selectedTicket, setSelectedTicket] = useState(null);
const [action, setAction] = useState(null);

const handleBuyTicket = (index) => {
setSelectedTicket(index);
setAction('buy');
alert('Verify PNR number before buying ticket!');
alert('Enter authentication code below to proceed further! (contact seller on phone number to get code)');

};

const handleRemoveTicket = (index) => {
setSelectedTicket(index);
setAction('remove');
alert('Enter authentication code below to proceed further! ( contact admin to get code )');
};

const handleAuthenticate = async (code) => {
if (selectedTicket !== null) {
const ticketRef = doc(collection(firestore, 'tickets'), tickets[selectedTicket].id);
const ticketData = await getDoc(ticketRef);

if (code === '12345' && action === 'buy') {
// Verify the ticket status before booking
if (ticketData.data().status === 'Available') {
alert('Ticket successfully booked!');
await updateDoc(ticketRef, { status: 'Booked' });
buyTicket(selectedTicket);
} else {
alert('This ticket has already been booked.');
}
} else if (code === '54321' && action === 'remove') {
// Verify the ticket status before removing
if (ticketData.data().status === 'Available') {
alert('Ticket successfully removed!');
await deleteDoc(ticketRef);
removeTicket(selectedTicket);
} else {
alert('This ticket has already been booked and cannot be removed.');
}
} else {
alert('Authentication code is incorrect. Please try again.');
}
setSelectedTicket(null);
setAction(null);
}
};

return (
<div>
<table className="ticket-table">
<thead>
<tr>
<th>Train No & DOJ</th>
<th>Train Name</th>
<th>PNR</th>
<th>Source & Destination</th>
<th>Departure Time</th>
<th>Seller Phone No</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{tickets.map((ticket, index) => (
<tr key={index} className={ticket.status === 'Booked' ? 'booked-row' : ''}>
<td>{ticket.trainNo}</td>
<td>{ticket.trainName}</td>
<td>{ticket.source}</td>
<td>{ticket.destination}</td>
<td>{ticket.departureTime}</td>
<td>{ticket.arrivalTime}</td>
<td>{ticket.status}</td>
<td>
{ticket.status === 'Available' && (
<>
<button className='dibbobuy' onClick={() => handleBuyTicket(index)}>Buy Ticket</button>
<button className='dibboremove' onClick={() => handleRemoveTicket(index)}>Remove</button>
</>
)}
</td>
</tr>
))}
</tbody>
</table>
{selectedTicket !== null && (
<div className="authentication-section">
<h3>Authentication Required</h3>
<AuthenticationForm onAuthenticate={handleAuthenticate} />
</div>
)}
</div>
);
};

export default TicketTable;