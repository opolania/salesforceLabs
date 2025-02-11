import { LightningElement } from "lwc";

export default class CarList extends LightningElement {
  carlist = [
    { id: "1", brand: "Ford2", model: "Mustang", year: 2020 },
    { id: "2", brand: "Nissan", model: "Altima", year: 2021 },
    { id: "3", brand: "Honda", model: "Accord", year: 2022 }
  ];
  handleAddCar() {
    // Simulate adding a new car
    const newCar = {
      id: (this.carlist.length + 1).toString(),
      brand: "Toyota" + (this.carlist.length + 1),
      model: "Camry",
      year: 2023
    };
    this.carlist = [...this.carlist, newCar]; // Create a new array reference
  }

  handleRemoveCar(event) {
    const carId = event.target.dataset.id;
    console.log("handleRemoveCar:" + event.target.dataset.id);
    // Remove a car based on its ID
    this.carlist = this.carlist.filter((car) => car.id !== carId);
  }
}
