const pool = require('../config/db');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const createUser = async (req, res) => {
  const { display_name, phone_number, email, role, work, password } = req.body;

  // ✅ Check for required fields
  if (!display_name || !phone_number || !email || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // ✅ Create user in Supabase Auth
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        display_name,
        role,
        phone_number
      }
    });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ message: 'Supabase user creation failed', error: error.message });
    }

    if (!user || !user.user || !user.user.id) {
      return res.status(500).json({ message: 'Supabase did not return a valid user object' });
    }

    const user_id = user.user.id;

    // ✅ Insert into the appropriate table
    let insertQuery, values;

    if (role === 'VENDOR') {
      insertQuery = `INSERT INTO vendor (vendor_id, vendor_name, phone_number, email, work)
                     VALUES ($1, $2, $3, $4, $5)`;
      values = [user_id, display_name, phone_number, email, work];
    } else if (role === 'SUPPLIER') {
      insertQuery = `INSERT INTO suppliers (supplier_id, supplier_name, phone_number, email, work)
                     VALUES ($1, $2, $3, $4, $5)`;
      values = [user_id, display_name, phone_number, email, work];
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
      await pool.query(insertQuery, values);
    } catch (dbErr) {
      console.error('❌ DB insertion error:', dbErr);
      return res.status(500).json({
        message: 'Failed to insert user details in database',
        error: dbErr.message
      });
    }

    return res.status(201).json({ message: 'User created successfully', user_id });
  } catch (err) {
    console.error('❌ Unexpected server error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUser = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'Missing user ID' });
  }

  try {
    const { data: user, error } = await supabase.auth.admin.getUserById(user_id);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ message: 'Supabase user retrieval failed', error: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User retrieved successfully', user });
  } catch (err) {
    console.error('❌ Unexpected server error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ message: 'Supabase users retrieval failed', error: error.message });
    }

    return res.status(200).json({ message: 'Users retrieved successfully', users: users.users });
  } catch (err) {
    console.error('❌ Unexpected server error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
module.exports = {
  createUser,
  getUser,
  getAllUsers
};

