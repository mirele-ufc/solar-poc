import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/useAuthStore'

import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { requiresGuest: true }
    },

    // ── ROTAS AUTENTICADAS (AuthLayout) ──────────────────────────────────────
    {
      path: '/',
      component: () => import('../components/shared/AuthLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // ── Perfil ──
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue')
        },

        // ── Meus Cursos ──
        {
          path: 'my-courses',
          name: 'my-courses',
          component: () => import('@/views/MyCoursesView.vue')
        },

        // ── Mensagens ──
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/MessageView.vue')
        },

        // ── Gestão e Criação de Cursos ──
        {
          path: 'create-course',
          meta: { requiresRole: 'professor' },
          children: [
            {
              path: '',
              name: 'create-course',
              component: () => import('@/views/CreateCourseView.vue')
            },
            {
              path: 'create-modules', 
              name: 'create-module',
              component: () => import('@/views/CreateModulesView.vue')
            },
            {
              path: 'exam',
              name: 'create-exam',
              component: () => import('@/views/CreateExamView.vue')
            }
          ]
        },

        // ── Cursos (Visão Geral e Detalhes) ──
        {
          path: 'courses',
          children: [
            {
              path: '',
              name: 'courses',
              component: () => import('../views/CoursesView.vue')
            },
            {
              path: ':id/manage',
              name: 'manage-course',
              component: () => import('../views/ManageCourseView.vue'),
              meta: { requiresRole: 'professor' }
            },

            // Rotas Dinâmicas Genéricas
            {
              path: ':id',
              name: 'course-detail',
              component: () => import('../views/CourseDetailsView.vue')
            },
            {
              path: ':id/enrollment',
              name: 'course-enrollment',
              component: () => import('../views/EnrollmentView.vue')
            },
            {
              path: ':id/modules',
              name: 'course-modules',
              component: () => import('../views/ModuleView.vue')
            },
            {
              path: ':id/modules/:modId',
              name: 'course-lessons',
              component: () => import('../views/LessonsView.vue')
            },
            {
              path: ':id/exam/instructions',
              name: 'course-exam-instructions',
              component: () => import('../views/ExamInstructionsView.vue')
            },
            {
              path: ':id/exam',
              name: 'course-exam-taking',
              component: () => import('../views/ExamView.vue')
            },
            {
              path: ':id/exam/results',
              name: 'course-exam-results',
              component: () => import('../views/ExamResultView.vue')
            },

            // ── Power BI ──
            {
              path: 'power-bi',
              children: [
                { path: '', component: () => import('../views/CourseDetailsView.vue') },
                { path: 'enrollment', component: () => import('../views/EnrollmentView.vue') },
                { path: 'modules/:modId', component: () => import('../views/LessonsView.vue') },
                { path: 'exam/instructions', component: () => import('../views/ExamInstructionsView.vue') },
                { path: 'exam', component: () => import('../views/ExamView.vue') },
                { path: 'exam/results', component: () => import('../views/ExamResultView.vue') },
              ]
            },

            // ── Python ──
            {
              path: 'python',
              children: [
                { path: '', name: 'python-detail', component: () => import('../views/PythonDetailsView.vue') },
                { path: 'enrollment', name: 'python-enrollment', component: () => import('../views/PythonEnrollmentView.vue') },
                { path: 'modules', name: 'python-modules', component: () => import('../views/PythonModuleView.vue') },
                { path: 'modules/:modId', name: 'python-lessons', component: () => import('../views/PythonLessonsView.vue') },
                { path: 'exam/instructions', name: 'python-exam-instructions', component: () => import('../views/PythonExamInstructionsView.vue') },
                { path: 'exam', name: 'python-exam', component: () => import('../views/PythonExamView.vue') },
                { path: 'exam/results', name: 'python-exam-results', component: () => import('../views/PythonExamResultView.vue') },
              ]
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
  const requiredRole = to.matched
    .map((record) => record.meta.requiresRole)
    .find((role): role is 'professor' | 'student' => typeof role === 'string')

  if (requiresAuth && !auth.isAuthenticated) return '/login'
  if (requiresGuest && auth.isAuthenticated) return '/courses'
  if (requiredRole && auth.currentUser.role !== requiredRole) return '/courses'
})

export default router