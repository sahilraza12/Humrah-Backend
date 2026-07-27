import Package from '../models/Package.js';

// @desc    Get all tour packages (With Search, Tag & Featured Filtering)
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req, res) => {
  try {
    const { keyword, tag, featured } = req.query;

    // Build dynamic query filter
    const query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' }; // Case-insensitive search
    }

    if (tag) {
      query.tag = tag;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Fetch matching packages, sorted by newest first
    const packages = await Package.find(query).sort({ createdAt: -1 });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single tour package by its unique URL slug
// @route   GET /api/packages/:slug
// @access  Public
export const getPackageBySlug = async (req, res) => {
  try {
    const tourPackage = await Package.findOne({ slug: req.params.slug });

    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour package not found' });
    }

    res.status(200).json(tourPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new tour package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req, res) => {
  try {
    const {
      title,
      duration,
      price,
      tag,
      locations, // Added locations field
      mainImage,
      gallery,
      inclusions,
      itinerary,
      featured,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: 'Title and Price are required' });
    }

    // Generate a URL-friendly slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Check for unique slug
    const slugExists = await Package.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'A package with this title already exists' });
    }

    const newPackage = new Package({
      title,
      slug,
      duration,
      price,
      tag,
      locations, // Saved locations to database
      mainImage,
      gallery,
      inclusions,
      itinerary,
      featured,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing tour package by ID or Slug
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const tourPackage = await Package.findById(id);

    if (!tourPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Update slug if title is modified
    if (req.body.title && req.body.title !== tourPackage.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tour package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (!tourPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await tourPackage.deleteOne();
    res.status(200).json({ message: 'Package removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};