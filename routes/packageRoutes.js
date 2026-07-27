import express from 'express';
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

// ------------------- PUBLIC ROUTES -------------------

// Get all packages (with search/filter query support)
router.get('/', getPackages);

// Single package by Slug (Public access)
router.get('/:slug', getPackageBySlug);

// ------------------- PROTECTED ADMIN ROUTES -------------------

// Create a new package
router.post('/', createPackage);

// Update an existing package by ID
router.put('/:id', updatePackage);

// Delete a package by ID (Protected by auth & admin middleware)
router.delete('/:id', deletePackage);

export default router;