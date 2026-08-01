'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    agreeToPolicies: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your message! (Demo only)')
    setFormData({
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      message: '',
      agreeToPolicies: false,
    })
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Contact Us</h1>
        <p className="mt-2 text-lg leading-8 text-slate-600 dark:text-slate-300">
          Share your questions and our team will get back to you with more information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              First name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="company" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Company
            </label>
            <div className="mt-2.5">
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="phone-number" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Phone number
            </label>
            <div className="mt-2.5">
              <input
                id="phone-number"
                name="phone-number"
                type="text"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="block w-full rounded-md bg-slate-100/80 px-3.5 py-2 text-base text-slate-900 outline-1 outline-slate-200/70 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 dark:bg-slate-800 dark:text-white dark:outline-slate-700/80 dark:placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-x-4 sm:col-span-2 items-center">
            <input
              id="agree-to-policies"
              name="agree-to-policies"
              type="checkbox"
              checked={formData.agreeToPolicies}
              onChange={(e) => setFormData({ ...formData, agreeToPolicies: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 bg-white/5 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600"
            />
            <label htmlFor="agree-to-policies" className="text-sm text-slate-600 dark:text-slate-400">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-indigo-500 dark:text-indigo-400">
                privacy policy
              </a>
              .
            </label>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Let&apos;s talk
          </button>
        </div>
      </form>
    </div>
  )
}
