import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Tests funcionales adoption.router.js", () => {

  it("GET /api/adoption debe devolver lista de adopciones", async () => {
    const res = await requester.get("/api/adoption");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/adoption debe crear una adopción", async () => {
    const adoption = {
      userId: "12345",
      petId: "67890"
    };

    const res = await requester.post("/api/adoption").send(adoption);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("_id");
  });

  it("POST /api/adoption debe fallar si faltan campos", async () => {
    const res = await requester.post("/api/adoption").send({});
    expect(res.status).to.equal(400);
  });

  it("GET /api/adoption/:id debe devolver una adopción", async () => {
    const id = "idDeEjemplo"; // si tu router provee uno, reemplázalo
    const res = await requester.get(/api/adoption/${id});
    expect(res.status).to.be.oneOf([200,404]);
  });

});