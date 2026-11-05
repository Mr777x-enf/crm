import { Router } from 'express';
import dashboard from '../controllers/dashboardController.js';
export default Router().get('/', dashboard);
