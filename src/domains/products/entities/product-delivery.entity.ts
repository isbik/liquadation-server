import { Embeddable, Enum } from '@mikro-orm/core';

export enum DeliveryMethod {
  SDEK = 'SDEK',
  RUSSIA_POST = 'RUSSIA_POST',
  PERSONAL_COURIER = 'PERSONAL_COURIER',
  PICKUP = 'PICKUP',
}

export enum DeliverySize {
  BOX = 'BOX',
  PALLET = 'PALLET',
  PALLET_SMALL = 'PALLET_SMALL',
  EUROPALLET = 'EUROPALLET',
  TRUCK_1_5 = 'TRUCK_1_5',
  TRUCK_3_5 = 'TRUCK_3_5',
  TRUCK_5 = 'TRUCK_5',
  TRUCK_10 = 'TRUCK_10',
  EUROFURA = 'EUROFURA',
  CONTAINER_22 = 'CONTAINER_22',
  CONTAINER_26 = 'CONTAINER_26',
  CONTAINER_30 = 'CONTAINER_30',
}

export enum Supplier {
  owner = 'owner',
  customer = 'customer',
}

@Embeddable()
export class ProductDelivery {
  @Enum(() => DeliveryMethod)
  method: DeliveryMethod;

  @Enum(() => DeliverySize)
  size: DeliverySize;

  /* Кто осуществляет доставку */
  @Enum(() => Supplier)
  supplier: Supplier;
}
