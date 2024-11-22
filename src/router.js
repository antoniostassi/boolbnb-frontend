import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import PromotionsPage from './pages/PromotionsPage.vue';
import ApartmentsPage from './pages/ApartmentsPage.vue';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage.vue';
import CreateApartmentPage from './pages/CreateApartmentPage.vue';
import AboutPage from './pages/AboutPage.vue';
import ServicesPage from './pages/ServicesPage.vue';
import ContactsPage from './pages/ContactsPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import LoginDialog from './components/login/LoginDialog.vue';
import EditApartmentPage from './pages/EditApartmentPage.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/promotions',
            name: 'promotions',
            component: PromotionsPage
        },
        {
            path: '/apartments',
            name: 'apartments',
            component: ApartmentsPage
        },
        {
            path: '/apartments/:id',
            name: 'apartments-details',
            component: ApartmentDetailsPage,
            props: true
        },
        {
            path: '/apartments/create',
            name: 'create-apartment',
            component: CreateApartmentPage,
            props: true
        },
        {
            path: '/apartments/edit/:id',
            name: 'edit-apartment',
            component: EditApartmentPage,
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage
        },
        {
            path: '/services',
            name: 'services',
            component: ServicesPage
        },
        {
            path: '/contacts',
            name: 'contacts',
            component: ContactsPage
        },
        {
            path:'/login',
            name: 'login',
            component:LoginDialog
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundPage
        }
    ]
});

export { router };