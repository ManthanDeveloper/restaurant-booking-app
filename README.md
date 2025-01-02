# **Restaurant App**  
###  **Overview**  
The Restaurant App is a simple and efficient system for managing restaurant bookings. Users can:  
- View their bookings.  
- Add new bookings.  
- Delete bookings.  

---

###  **Features**
1. **User Authentication** via cookies.  
2. **Create, View, and Delete Bookings**.  
3. Store data locally in a JSON file.  

---

#### **Steps to Deploy Locally**  
1. Clone the repository from GitHub:  
   ```bash
   git clone (https://github.com/ManthanDeveloper/restaurant-booking-app).git
   cd frontend
   npx create-next-app@latest or yarn create next-app or pnpm create next-app
   npm run dev #frontend server running
   cd backend
   npm install body-parser cookie-parser cors express mongoose fs
   Now Setup database or MongoDB url and cors url
   Run Using Nodemon index.js or npm run start

#### How Application Looking Like
##### Creating Booking
![booking_create](https://github.com/user-attachments/assets/ab970fc5-2769-463d-a555-149f6ba24bf0)

##### Read Booking Deatils
![booking_read](https://github.com/user-attachments/assets/91396b9d-e40d-4056-bb8b-c5e548e01bbc)

##### Delting Booking
![booking_delete](https://github.com/user-attachments/assets/820edef9-261b-4029-ae5c-cf138f027bbd)

##### Duplicate Booking Not allowed
![booking_duplicate](https://github.com/user-attachments/assets/44383cdb-27c1-4d94-82da-1c88c2f06740)


