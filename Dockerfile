# ใช้ Node.js เวอร์ชัน LTS
FROM node:18

# สร้าง working directory
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกไฟล์ทั้งหมดเข้า container
COPY . .

# เปิดพอร์ต
EXPOSE 3000

# สั่งรัน server
CMD ["npm", "start"]
