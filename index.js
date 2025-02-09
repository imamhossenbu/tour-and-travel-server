const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS
const PORT = process.env.PORT || 5000;
dotenv.config();
const axios = require('axios')

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());



const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'tour_management',
});


app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // If the user does not exist, insert them 
    const insertUserQuery = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
    const role = 'user';

    db.query(insertUserQuery, [name, email, role], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(201).json({ success: true, message: 'Sign up successful', userId: result.insertId });
    });
  });
});



app.get('/api/users', (req, res) => {
  const query = 'SELECT id, name, email, role FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true, data: results });
  });
});


app.get('/users/isAdmin/:email', (req, res) => {
  const email = req.params.email;
  const query = "SELECT role FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Database error" });
    }
    if (results.length > 0 && results[0].role === "admin") {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  });
})


app.patch('/api/users/make-admin/:id', (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ success: false, error: 'Role is required' });
  }

  const query = 'UPDATE users SET role = ? WHERE id = ?';

  db.query(query, [role, id], (err, result) => {
    if (err) {
      console.error('Error updating user role:', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User role updated successfully' });
  });
})




// destination tables

app.post("/destinations", (req, res) => {
  const { name, location, description, image } = req.body;

  if (!name || !location || !description || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = "INSERT INTO destinations (name, location, description, image) VALUES (?, ?, ?, ?)";
  db.query(query, [name, location, description, image], (err, result) => {
    if (err) {
      console.error("Error inserting destination:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.status(201).json({ success: true, message: "Destination added successfully!", id: result.insertId });
  });
});


// API endpoint to get all destinations
app.get("/destinations", (req, res) => {
  const query = "SELECT * FROM destinations";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching destinations:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({ success: true, data: results });
  });
});



// packages tables

// post packages
app.post('/packages', (req, res) => {
  const { destination_id, title, description, price, duration, image } = req.body;

  if (!destination_id || !title || !description || !price || !duration || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = "INSERT INTO packages (destination_id, title, description, price, duration, image) VALUES (?,?,?,?,?,?)"

  db.query(query, [destination_id, title, description, price, duration, image], (err, result) => {
    if (err) {
      console.error("Error inserting destination:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.status(201).json({ success: true, message: "Destination added successfully!", id: result.insertId });
  });

})


// get all packages

app.get('/packages', (req, res) => {
  const query = "SELECT * FROM packages";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching destinations:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({ success: true, data: results });
  });

})


// get destination by id
app.get('/destinations/:id', (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM destinations WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching destination details:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    res.status(200).json({ success: true, data: results[0] });
  });
});


// get packages by destination_id
app.get('/packages', (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "Destination ID is required" });
  }

  const query = "SELECT * FROM packages WHERE destination_id = ?";
  db.query(query, [parseInt(id)], (err, results) => {
    if (err) {
      console.error("Error fetching packages:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({ success: true, data: results });
  });
});


// itinerary
app.post("/itinerary", (req, res) => {
  const itineraries = req.body;

  if (!Array.isArray(itineraries) || itineraries.length === 0) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const sql = `INSERT INTO itinerary (package_id, day_number, activity, details) VALUES ?`;

  const values = itineraries.map((item) => [
    item.package_id,
    item.day_number,
    item.activity,
    item.details,
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error inserting itinerary:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "Itinerary added successfully", inserted: result.affectedRows });
  });
});


app.get("/itinerary/:package_id", (req, res) => {
  const { package_id } = req.params;
  db.query("SELECT * FROM itinerary WHERE package_id = ?", [package_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});


app.get("/packages/:package_id", (req, res) => {
  const { package_id } = req.params;
  db.query("SELECT * FROM packages WHERE id = ?", [package_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});



// reviews 
app.post('/reviews/:id', (req, res) => {
  const { id } = req.params; // Package ID from URL parameter
  const { rating, message, name, uid, photo } = req.body; // Rating, message, user info


  // Insert the review into the 'reviews' table
  const query = `
          INSERT INTO reviews (package_id, rating, message, user_name, user_uid, user_photo_url) 
          VALUES (?, ?, ?, ?, ?, ?)
      `;

  db.query(query, [id, rating, message, name, uid, photo], (err, result) => {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ error: 'Failed to submit review' });
    }
    return res.status(201).json({ message: 'Review submitted successfully' });
  });
});

app.get('/reviews/:id', (req, res) => {
  const { id } = req.params; // Package ID from URL parameter

  const query = 'SELECT * FROM reviews WHERE package_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    return res.status(200).json(results); // Return the reviews for the specific package
  });
});


// wishlist

app.post('/wishlist/:id', (req, res) => {
  const { id } = req.params;
  const { uid } = req.body;

  console.log(uid);
  const query = `INSERT INTO wishlist (user_id,package_id) VALUES (?, ?)`

  db.query(query, [uid, id], (err, result) => {
    if (err) {
      console.error('Error inserting review:', err);
      return res.status(500).json({ error: 'Failed to submit review' });
    }
    return res.status(201).json({ message: 'Review submitted successfully' });
  })
})


app.get('/wishlist/:id', (req, res) => {
  const id = req.params.id;

  const query = "SELECT * FROM wishlist WHERE user_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching wishlist:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
})

app.get("/reviews", (req, res) => {
  const sql = "SELECT * FROM reviews";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching wishlist:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(result);
  });
});


app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reviews WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting review:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  });
});

app.patch('/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { message, rating } = req.body;

  const query = "UPDATE reviews SET message = ?, rating = ? WHERE id = ?";

  db.query(query, [message, rating, id], (err, result) => {
    if (err) {
      console.error("Error updating review:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  });
});


// booking

app.post("/bookings", (req, res) => {
  const { userId, packageId, travelDate, numTravelers, phone, email, totalPrice } = req.body;

  if (!userId || !packageId || !travelDate || !numTravelers || !phone || !email || !totalPrice) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const query = `
      INSERT INTO bookings (user_id, package_id, travel_date, num_travelers, phone, email, total_price) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [userId, packageId, travelDate, numTravelers, phone, email, totalPrice], (err, result) => {
    if (err) {
      console.error("Error inserting booking:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // ✅ Send the booking ID back so frontend can redirect to payment
    res.status(201).json({ success: true, bookingId: result.insertId, message: "Booking confirmed!" });
  });
});


app.get("/bookings/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT bookings.id AS booking_id, bookings.travel_date, bookings.num_travelers, 
             bookings.phone, bookings.email, bookings.total_price, bookings.status,
             packages.title AS package_title, packages.image AS package_image
      FROM bookings
      JOIN packages ON bookings.package_id = packages.id
      WHERE bookings.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.status(200).json({ success: true, data: results });
  });
});

app.get("/admin/bookings", (req, res) => {
  const query = `
      SELECT 
          bookings.id AS booking_id, bookings.travel_date, bookings.num_travelers, 
          bookings.total_price, bookings.status,
          packages.title AS package_title, packages.image AS package_image
      FROM bookings
      JOIN packages ON bookings.package_id = packages.id
      ORDER BY bookings.created_at DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all bookings:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.status(200).json({ success: true, data: results });
  });
});

app.patch("/bookings/cancel/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  const query = "UPDATE bookings SET status = 'Cancelled' WHERE id = ?";

  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error("Error updating booking status:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  });
});

// approve booking
app.patch("/bookings/approve/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  const query = "UPDATE bookings SET status = 'Confirmed' WHERE id = ?";
  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error("Error approving booking:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.status(200).json({ success: true, message: "Booking approved!" });
  });
});


// ✅ Approve Cancellation Request (Admin Grants Refund)
app.patch("/bookings/cancel/approve/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  const query = "UPDATE bookings SET status = 'Cancelled with Refund' WHERE id = ?";
  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error("Error approving cancellation:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.status(200).json({ success: true, message: "Cancellation approved with refund!" });
  });
});


app.get('/bookings/details/:bookingId', (req, res) => {
  const { bookingId } = req.params; // Changed to use 'id' as it comes from the route parameter
  const query = `
    SELECT 
      bookings.id AS booking_id, 
      bookings.user_id, 
      bookings.travel_date, 
      bookings.num_travelers, 
      bookings.phone, 
      bookings.email, 
      bookings.total_price, 
      bookings.status, 
      packages.title AS package_title, 
      packages.image AS package_image 
    FROM bookings 
    JOIN packages ON bookings.package_id = packages.id 
    WHERE bookings.id = ?`;

  db.query(query, [bookingId], (err, results) => {
    if (err) {
      console.error("Error fetching booking:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ success: true, data: results[0] });
  });
});


// payment initiated

app.post('/sslcommerz/initiate', async (req, res) => {
  const {
    booking_id,
    user_id,
    amount,
    currency,
    cus_name,
    cus_email,
    cus_phone,
    payment_status
  } = req.body;

  // const store_id = process.env.SSL_store_id;
  // const store_passwd = process.env.SSL_store_passwd;

  const tran_id = `tran_${Date.now()}`
  const paymentData = {
    store_id: 'trave67a744c6aff5c',
    store_passwd: "trave67a744c6aff5c@ssl",
    total_amount: amount,
    currency: 'BDT',
    tran_id: tran_id, // Use unique tran_id for each API call
    success_url: 'https://tour-and-travel-server-sigma.vercel.app/success',
    fail_url: 'https://simple-firebase-9936c.web.app/fail',
    cancel_url: 'https://simple-firebase-9936c.web.app/cancel',
    ipn_url: 'https://tour-and-travel-server-sigma.vercel.app/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: cus_name,
    cus_email: cus_email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: cus_phone,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  try {
    const iniResponse = await axios({
      url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      method: "POST",
      data: paymentData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (iniResponse.data.GatewayPageURL) {
      const paymentInsertQuery = `
        INSERT INTO payments (
          booking_id, user_id, amount, currency, cus_name, cus_email, cus_phone,
          payment_date, payment_status, payment_method, transaction_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const paymentValues = [
        booking_id,
        user_id,
        amount,
        currency,
        cus_name,
        cus_email,
        cus_phone,
        new Date(),           // Set payment date to current time
        payment_status,       // Payment status (could be "Pending" initially)
        'SSLCommerz',         // Payment method
        tran_id, // Transaction ID
      ];

      db.query(paymentInsertQuery, paymentValues, (err, result) => {
        if (err) {
          console.error('Error inserting payment data:', err);
          return res.status(500).json({ success: false, message: 'Failed to save payment data' });
        }

        // Respond with success and redirect URL
        res.json({
          success: true,
          message: 'Payment initialization successful',
          GatewayPageURL: iniResponse.data.GatewayPageURL, // Provide URL to redirect user
        });
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Payment initialization failed',
      });
    }

  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating payment',
    });
  }
});


app.post('/success', async (req, res) => {
  const paymentData = req.body;

  // Log payment data for debugging
  console.log(paymentData);

  // Extract val_id and tran_id from paymentData to use in validation request
  const { val_id, tran_id } = paymentData;

  try {
    // Corrected URL for SSLCommerz validation API request
    const validationUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=trave67a744c6aff5c&store_passwd=trave67a744c6aff5c@ssl&format=json`;

    // Make GET request to validate payment
    const isValidPayment = await axios.get(validationUrl);

    if (isValidPayment.data.status === 'VALID') {
      // 1. Update payment status
      const paymentUpdateQuery = `
          UPDATE payments
          SET payment_status = ?
          WHERE transaction_id = ?
        `;
      const paymentValues = ['success', tran_id];

      db.query(paymentUpdateQuery, paymentValues, (err, result) => {
        if (err) {
          console.error('Error updating payment status:', err);
          return res.status(500).json({ success: false, message: 'Error updating payment status' });
        }
      });

      // 2. Query the payments table to get the booking_id based on transaction_id
      const bookingQuery = `
        SELECT booking_id
        FROM payments
        WHERE transaction_id = ?
      `;
      db.query(bookingQuery, [tran_id], (err, result) => {
        if (err) {
          console.error('Error fetching booking data:', err);
          return res.status(500).json({ success: false, message: 'Error fetching booking data' });
        }

        if (result.length > 0) {
          const booking_id = result[0].booking_id;

          // 3. Update the booking status to 'confirmed'
          const bookingUpdateQuery = `
            UPDATE bookings
            SET status = ?
            WHERE id = ?
          `;
          const bookingValues = ['confirmed', booking_id];

          db.query(bookingUpdateQuery, bookingValues, (err, result) => {
            if (err) {
              console.error('Error updating booking status:', err);
              return res.status(500).json({ success: false, message: 'Error updating booking status' });
            }

            // ✅ Redirect to the My Bookings page on frontend after successful payment
            return res.redirect(`https://simple-firebase-9936c.web.app/payment-success?tran_id=${tran_id}`);
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'No booking found for this transaction.',
          });
        }
      });
    } else {
      // Payment is invalid
      res.status(400).json({
        success: false,
        message: 'Invalid payment. Please check your transaction.',
      });
    }
  } catch (error) {
    console.error('Error validating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate payment.',
    });
  }
});



app.patch('/bookings/update/:bookingId', (req, res) => {
  const { bookingId } = req.params;  // Extract the booking ID from the URL
  const bookingUpdateQuery = `
    UPDATE bookings
    SET status = ?
    WHERE id = ?
  `;
  const bookingValues = ['confirmed', bookingId]; // Set status to 'confirmed'

  db.query(bookingUpdateQuery, bookingValues, (err, result) => {
    if (err) {
      console.error('Error updating booking status:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update booking status.',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated to confirmed.',
    });
  });
});

// This route is for requesting the cancellation of a booking.
app.patch('/bookings/cancel/request/:bookingId', (req, res) => {
  const { bookingId } = req.params;

  // Query to update the booking status to "Cancellation Requested"
  const updateBookingQuery = `
    UPDATE bookings
    SET status = 'Cancellation Requested'
    WHERE id = ?
  `;

  db.query(updateBookingQuery, [bookingId], (err, result) => {
    if (err) {
      console.error('Error requesting cancellation:', err);
      return res.status(500).json({
        success: false,
        message: 'Error requesting cancellation. Please try again.',
      });
    }

    if (result.affectedRows > 0) {
      // Successfully updated booking status
      return res.status(200).json({
        success: true,
        message: 'Cancellation request successfully sent.',
      });
    } else {
      // No rows affected, meaning the bookingId doesn't exist
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }
  });
});


app.patch("/bookings/cancel/deny/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  // Ensure that bookingId exists
  const query = "UPDATE bookings SET status = 'Confirmed' WHERE id = ?";
  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error("Error denying cancellation:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Cancellation request denied!" });
  });
});


// payment 
// Fetch all payments (Admin)
app.get("/admin/payments", (req, res) => {
  const query = "SELECT * FROM payments";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ data: result });
  });
});

// Delete payment (Admin)
app.delete("/admin/payments/:paymentId", (req, res) => {
  const { paymentId } = req.params;
  const query = "DELETE FROM payments WHERE id = ?";
  db.query(query, [paymentId], (err, result) => {
    if (err) {
      console.error("Error deleting payment:", err);
      return res.status(500).json({ error: "Database delete failed" });
    }
    res.status(200).json({ success: true, message: "Payment deleted successfully!" });
  });
});


// Get payments for the logged-in user
app.get("/user/payments/:email", (req, res) => {
  const { email } = req.params; // Assuming the user is authenticated and `req.user` contains the logged-in user's data

  const query = "SELECT * FROM payments WHERE cus_email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ data: result });
  });
});




// ✅ Delete Booking (Admin Removes Booking)
app.delete("/bookings/admin/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  // Check for the booking existence
  const checkBookingQuery = "SELECT * FROM bookings WHERE id = ?";
  db.query(checkBookingQuery, [bookingId], (err, result) => {
    if (err) {
      console.error("Error checking booking existence:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete related payments first (if any foreign key constraint exists)
    const deletePaymentsQuery = "DELETE FROM payments WHERE booking_id = ?";
    db.query(deletePaymentsQuery, [bookingId], (err, result) => {
      if (err) {
        console.error("Error deleting payments:", err);
        return res.status(500).json({ error: "Error deleting payments" });
      }

      // Now, delete the booking
      const deleteBookingQuery = "DELETE FROM bookings WHERE id = ?";
      db.query(deleteBookingQuery, [bookingId], (err, result) => {
        if (err) {
          console.error("Error deleting booking:", err);
          return res.status(500).json({ error: "Error deleting booking" });
        }

        res.status(200).json({ success: true, message: "Booking deleted successfully!" });
      });
    });
  });
});




app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT w.id AS wishlist_id, w.user_id, w.package_id, 
             p.title, p.description, p.price, p.image
      FROM wishlist w
      INNER JOIN packages p ON w.package_id = p.id
      WHERE w.user_id = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching wishlist:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.status(200).json({ success: true, data: results });
  });
});

app.delete('/wishlist/:id', (req, res) => {
  const { id } = req.params; // Extract wishlist item ID from URL

  const query = "DELETE FROM wishlist WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting wishlist item:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.status(200).json({ message: "Wishlist item deleted successfully" });
  });
});



app.get('/reviews/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT r.id, r.message, r.rating, 
             p.title AS package_name, p.image
      FROM reviews r
      JOIN packages p ON r.package_id = p.id
      WHERE r.user_uid = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ success: true, data: results });
  });
});


// Store ID: trave67a744c6aff5c
// Store Password (API/Secret Key): trave67a744c6aff5c@ssl
// Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)
// Store name: testtravexcmi
// Registered URL: www.tourtravel.com
// Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
// Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
// Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php







db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


app.get('/', (req, res) => {
  res.send('hello there!')
})



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});