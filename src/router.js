import { createRouter, createWebHistory } from 'vue-router';

// NavbarPages
import HomePage from './pages/NavbarPages/HomePage.vue';
import ApartmentsPage from './pages/NavbarPages/ApartmentsPage.vue';
import PromotionsPage from './pages/NavbarPages/PromotionsPage.vue';
import AboutPage from './pages/NavbarPages/AboutPage.vue';
import ContactsPage from './pages/NavbarPages/ContactsPage.vue';

// SingleApartmentPage
import ApartmentDetailsPage from './pages/SingleApartmentPage/ApartmentDetailsPage.vue';

// UserPages
import ProfilePage from './pages/UserPages/ProfilePage.vue';
import StatsPage from './pages/UserPages/StatsPage.vue';

// ApartmentsCRUDPages
import DashboardPage from './pages/ApartmentsCRUDPages/DashboardPage.vue'; // Show
import CreateApartmentPage from './pages/ApartmentsCRUDPages/CreateApartmentPage.vue'; // Create
import EditApartmentPage from './pages/ApartmentsCRUDPages/EditApartmentPage.vue'; // Edit

// PromotionsChoicePages
import PromotionsChoicePage from './pages/Check-outPages/PromotionsChoicePage.vue'

// NotFoundPage
import NotFoundPage from './pages/NotFoundPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [

        // NavbarPages
        { path: '/', name: 'home', component: HomePage },
        { path: '/apartments', name: 'apartments', component: ApartmentsPage },
        { path: '/promotions', name: 'promotions', component: PromotionsPage },
        { path: '/about', name: 'about', component: AboutPage },
        { path: '/contacts', name: 'contacts', component: ContactsPage
        },

        // SingleApartmentPage
        { path: '/apartments/:id', name: 'apartments-details', component: ApartmentDetailsPage, props: true },

        // UserPages
        {  path: '/user/profile', name: 'profile-page', component: ProfilePage },
        {  path: '/user/stats/:id', name: 'stats-page', component: StatsPage, props: true },

        // ApartmentsCRUDPages
        { path: '/user/dashboard', name: 'your-apartments', component: DashboardPage },
        {  path: '/apartments/create', name: 'create-apartment', component: CreateApartmentPage, props: true },
        { path: '/apartments/edit', name: 'edit-apartment', component: EditApartmentPage },

        // PromotionsChoicePages
        { path: '/apartments/create/promotion', name: 'PromotionsChoice', component: PromotionsChoicePage },

        // NotFoundPage
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
    ]
});

export { router };