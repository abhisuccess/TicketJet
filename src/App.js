import React, { useState, useEffect } from 'react';
import './App.css';
import TicketForm from './TicketForm';
import TicketTable from './TicketTable';
import { collection, getDocs, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import firestore from './firebase';
import trainImage from 'D://train-ticket-app-hanumanji//train-ticket-booking//src//img//giphy.gif';// Import the image file


const App = () => {
  const [tickets, setTickets] = useState([]);

  // Fetch tickets from Firebase and update state
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'tickets'));
        const updatedTickets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTickets(updatedTickets);
      } catch (error) {
        console.error('Error fetching tickets: ', error);
      }
    };
  
    fetchTickets(); // Fetch tickets once during component mount
  
    // Use onSnapshot to listen for real-time updates (optional)
    const unsubscribe = onSnapshot(collection(firestore, 'tickets'), (snapshot) => {
      const updatedTickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(updatedTickets);
    });
  
    return () => unsubscribe();
  }, []);

  const addTicket = async (ticket) => {
  try {
    const docRef = doc(collection(firestore, 'tickets'));

    await setDoc(docRef, ticket);

    // Fetch the latest data from Firebase
    const updatedTickets = await getDocs(collection(firestore, 'tickets'));
    setTickets(updatedTickets.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error('Error adding ticket: ', error);
  }
};
  const buyTicket = async (index) => {
    const selectedTicket = tickets[index];
    if (selectedTicket.status === 'Available') {
      try {
        await setDoc(doc(collection(firestore, 'tickets'), selectedTicket.id), {
          ...selectedTicket,
          status: 'Booked',
        });

        setTickets((prevTickets) => {
          const updatedTickets = [...prevTickets];
          updatedTickets[index].status = 'Booked';
          return updatedTickets;
        });
      } catch (error) {
        console.error('Error buying ticket: ', error);
      }
    }
  };

  const removeTicket = async (index) => {
    const selectedTicket = tickets[index];
    if (selectedTicket.status === 'Available') {
      try {
        await deleteDoc(doc(collection(firestore, 'tickets'), selectedTicket.id));

        setTickets((prevTickets) => {
          const updatedTickets = [...prevTickets];
          updatedTickets.splice(index, 1);
          return updatedTickets;
        });
      } catch (error) {
        console.error('Error removing ticket: ', error);
      }
    }
  };

  const faqItems = [
    {
      question: 'How to buy a ticket through this website?',
      answer: 'Buying a ticket is easy! Simply browse the available tickets in the table and click on the "Buy" button.',
    },
    {
      question: 'How to get authentication code for buying or removing ticket?',
      answer: 'Very easy, just conatact the admin/seller phone number, he will provide you the authentication code! Happy booking',
    },
    {
      question: 'Are there any charges for using this platform?',
      answer: 'No, using our platform is completely free for both sellers and buyers.',
    },
    {
      question: 'How to add a ticket?',
      answer: 'Adding a ticket is a breeze! Use the "Add Ticket" form above and fill in the required details.',
    },
    // Add more FAQ items as needed
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <h1 className='dibbo'>TicketJet - Ticket Booking App</h1>
      <div className='welcome-container'>
        <img className='train-image' src={trainImage} alt='Train' />
        <div className='welcome-text'>
          <p>
            Welcome to our Train Ticket Booking App! Whether you're in need of a last-minute ticket or have
            a confirmed ticket that you'd like to sell, our platform makes it easy for travelers to connect.
          </p>
          <p>
            If you have a confirmed ticket for a particular train, and all the seats are filled, you can help
            someone else in need. Simply upload your ticket details, and users looking for tickets can buy them
            even if the train is fully booked.
          </p>
          <p>
            On the other hand, if you are urgently in need of a ticket for a fully booked train, our platform
            allows you to search for available tickets. Just enter the verification code provided by the seller,
            and you can book your ticket seamlessly.
          </p>
          <p>
            Experience the convenience of buying and selling train tickets hassle-free. Get started now!
          </p>
        </div>
      </div>
      <h3 className='abhisu'>Canceling your ticket? Don't stress! Add it here, and we'll find a buyer for you.</h3>
      <TicketForm addTicket={addTicket} />
      <TicketTable tickets={tickets} buyTicket={buyTicket} removeTicket={removeTicket} />

       {/* FAQ Section */}
       <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq-list">
          {faqItems.map((item, index) => (
            <li key={index} className="faq-item">
              <h3 onClick={() => toggleAnswer(index)}>{item.question}</h3>
              <p className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>{item.answer}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Footer section */}
      <footer className="footer">
        <p>&copy; 2023 Train Ticket Booking App. Made with <span role="img" aria-label="love">❤️</span> by Abhi Success.</p>
        <p>admin @ abhisuccess499@gmail.com</p>
      </footer>
    </div>
  );
};

export default App;
