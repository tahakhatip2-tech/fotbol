import prisma from '../config/db';

export const notifyUser = async (userId: string, title: string, message: string, type: string, link?: string) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link
      }
    });
  } catch (error) {
    console.error('Failed to send notification to user:', error);
  }
};

export const notifyAdmins = async (title: string, message: string, type: string, link?: string) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true }
    });

    const notifications = admins.map(admin => ({
      userId: admin.id,
      title,
      message,
      type,
      link
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications
      });
    }
  } catch (error) {
    console.error('Failed to send notification to admins:', error);
  }
};
