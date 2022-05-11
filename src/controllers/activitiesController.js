
import { openDatabase } from "../database.js";


export const activityCheckin = async (request, response) => {
  const { label } = request.body;
  const db = await openDatabase();

  const vehicle = await db.get(
    `
    SELECT * FROM vehicles WHERE label = ?
  `,
    [label]
  );
  if (vehicle) {
    const checkoinAt = new Date().getTime();
    const data = await db.run(
      `
      INSERT INTO activities ( vehicle_id, chekin_at )
      VALUES (?,?)
    `,
      [vehicle.id, checkoinAt]
    );
    db.close();
    response.send({
      vehicle_id: vehicle.id,
      checkoinAt: checkoinAt,
      message: `Veículo [${vehicle.label}] Entrou no estacionamento!`,
    });
    return;
  }
  db.close();
  response.status(400).send({
    message: `Veículo [${label}] não cadastrado`,
  });
};

export const activityCheckout = async (request, response) => {
  const { label, price } = request.body;
  const db = await openDatabase();

  const vehicle = await db.get(
    `
    SELECT * FROM vehicles WHERE label = ?
  `,
    [label]
  );
  if (vehicle) {
    const ActivityOpen = await db.get(
      `
    SELECT * 
      FROM activities
    WHERE vehicle_id = ?
      AND chekout_at IS NULL
  `,
      [vehicle.id]
    );
    if (ActivityOpen) {
      const checkoutAt = new Date().getTime();
      const data = await db.run(
        `
        UPDATE activities
          SET chekout_at = ?,
            price = ?
        WHERE id = ?
    `,
        [ActivityOpen.id, price, ActivityOpen.id]
      );
      db.close();
      response.send({
        vehicle_id: vehicle.id,
        checkoutAt: checkoutAt,
        price: price,
        message: `Veículo [${vehicle.label}] saiu do estacionamento!`,
      });
      return;
    }
    db.close();
    response.statu(400).send({
      message: `Veículo [${label}] não realizou nenhum check-in`,
    });
    return;
  }
  db.close();
  response.send({
    message: `Veículo [${label}] não cadastrado`,
  });
};

export const removeActivity = async (request, response) => {
  const { id } = request.params;
  const db = await openDatabase();
  const data = await db.run(
    `
      DELETE FROM  activities 
      WHERE id = ?
  `,
    [id]
  );
  db.close();
  response.send({
    id,
    message: `Atividade [${id}] removida com sucesso!`,
  });
};

export const listActivities = async (request, response) => {
  const db = await openDatabase();
  const activities = await db.all(`
    SELECT * FROM activities
    `);
  db.close();
  response.send(activities);
}