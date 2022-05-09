import { Category } from '@/domains/categories/entities/category.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

const items = [
  {
    name: `Автомобили, аксессуары, запчасти, транспорт`,
    children: [
      `Автоаксессуары и автохимия`,
      `Автомобили грузовые и специальная техника`,
      `Автомобили легковые`,
      `Автошины, диски`,
      `Водный транспорт`,
      `Воздушный транспорт`,
      `Грузовые запчасти`,
      `Запчасти для легковых автомобилей`,
      `Запчасти для водного транспорта`,
      `Запчасти для воздушного транспорта`,
      `Запчасти универсальные`,
      `Запчасти к мототехнике`,
      `Запчасти к спецтехнике и сельхозтехнике `,
      `Мототехника`,
      `Спецтехника, сельхозтехника`,
    ],
  },
  {
    name: `Горюче-смазочные материалы`,
    children: [
      `Бензин, керосин, дизельное топливо`,
      `Горючие газы`,
      `Масла и смазки`,
      `Нефтяные битумы`,
      `Уголь, торф, сланцы`,
      `Экстракты, растворители, присадки, техническая жидкость`,
    ],
  },
  {
    name: `Древесина, пиломатериалы и бумага`,
    children: [
      `Бумага, картон`,
      `Полиматериалы`,
      `Столярные и мебельные материалы`,
      `Фанера, шпон, ДСП, цементно-стружечные плиты`,
    ],
  },
  {
    name: `Мебель, предметы интерьера, фурнитура`,
    children: [
      `Дачная мебель`,
      `Мебельная фурнитура и комплектующие`,
      `Металлическая мебель, шкафы, стеллажи`,
      `Мягкая и корпусная мебель, стулья, матрасы`,
      `Офисная, производственная, специальная мебель`,
      `Предметы интерьера`,
    ],
  },
  {
    name: `Медицина, фармацевтика, ветеринария`,
    children: [
      `Медицинские расходные материалы и одноразовые инструменты`,
      `Фармацевтические, ветеринарные, гигиенические средства и препараты`,
    ],
  },
  {
    name: `Металлы и металлопрокат`,
    children: [
      `Балка, угол, арматура`,
      `Благородные металлы и изделия`,
      `Запорная арматура`,
      `Столярные и мебельные материалы`,
      `Листовой прокат, круг, квадрат`,
      `Металлические тросы, проволока, сетка`,
      `Металлоконструкции и сооружения`,
      `Нержавеющие и специальные стали`,
      `Рельсы, материалы верхнего строения пути`,
      `Трубы стальные, чугунные`,
      `Ферросплавы и лигатуры`,
      `Цветной металлопрокат, сплавы`,
      `Черные металлы, сплавы`,
      `Элемента крепежа`,
    ],
  },
  {
    name: `Оборудование, приборы, инструменты`,
    children: [
      `Медицинские расходные материалы и одноразовые инструменты`,
      `Медицинское оборудование, инструменты`,
      `Весоизмерительное оборудование`,
      `Газовое и топливное оборудование`,
      `Горнодобывающее и перерабатывающее оборудование`,
      `Грузоподъемное  оборудование и машины, лифты`,
      `ДВС универсального назначения`,
      `Деревообрабатывающее оборудование`,
      `Железнодорожное оборудование`,
      `Звуковое, световое оборудование`,
      `Инструмент ручной, электрический, гидравлический, пневматический `,
      `Коммунальное оборудование`,
      `Котельное оборудование`,
      `Лабораторное оборудование`,
      `Металлообрабатывающее оборудование`,
      `Металлургическое и кузнечно-прессовое оборудование`,
      `Насосы, компрессоры, гидравлика, пневматика`,
      `Нефте, газодобывающее, буровое оборудование`,
      `Оборудование для автозаправочных станций (АЗС)`,
      `Оборудование для автосервиса, ремонта и обслуживания автомобилей`,
      `Оборудование для литья, обработки и переработки пластмасс`,
      `Оборудование для обработки и очистки воды`,
      `Оборудование для переработки отходов`,
      `Оборудование для производства упаковки, упаковочное оборудование`,
      `Оборудование для производства электротехнической продукции`,
      `Оборудование для электростанций и производства энергии`,
      `Парикмахерское оборудование`,
      `Пищевое оборудование`,
      `Подшипники и детали узлов`,
      `Полиграфическое оборудование`,
      `Противопожарное, охранное, спасательное оборудование`,
      `Прочее промышленное оборудование`,
      `Резервуарное оборудование`,
      `Сварочное и паяльное оборудование`,
      `Сельхозоборудование, животноводческое оборудование`,
      `Складское оборудование`,
      `Строительное, дорожное оборудование`,
      `Фильтры и фильтроэлементы`,
      `Химическое оборудование`,
      `Холодильное оборудование`,
      `Цепи, редукторы, вариаторы`,
      `Швейное, ткацкое оборудование`,
    ],
  },
  {
    name: `Одежда, обувь, текстиль`,
    children: [
      `Канаты, веревки`,
      `Дорожные принадлежности`,
      `Нити текстильные и пряжа`,
      `Одеяла, покрывала, скатерти`,
      `Спецодежда, обувь, головные уборы`,
      `Средства индивидуальной защиты`,
      `Ткани и текстильные изделия`,
    ],
  },
  {
    name: `Отходы производства, вторсырье`,
    children: [
      `Жидкие отходы`,
      `Лом аккумуляторов`,
      `Лом и отходы драгметаллов`,
      `Отработанные нефтепродукты`,
      `Отходы полимеров и пластмасс`,
      `Отходы химической промышленности`,
      `Прочие отходы`,
      `Текстильные отходы`,
      `Цветной металлолом`,
      `Черный металлолом`,
      `Шины и резиновые отходы`,
      `Электронный лом`,
    ],
  },
  {
    name: `Промышленная электроника`,
    children: [
      `Аудио, видео, фото техника`,
      `Компьютеры, комплектующие, оргтехника, программное обеспечение`,
      `Контрольно-измерительные приборы и средства автоматизации`,
      `Сетевое оборудование, телевидение, радиосвязь`,
      `Электронные блоки и элементы питания электронной аппаратуры`,
      `Электронные компоненты, радиодетали`,
    ],
  },
  {
    name: `Стройматериалы`,
    children: [
      `Бытовая и железобетонные изделия, кирпич, камень, плитка`,
      `Вяжущие материалы, заполнители, бетоны, растворы, смеси`,
      `Кровельные материалы`,
      `Леса строительные, опалубка`,
      `напольные покрытия`,
      `Огнеупорные материалы`,
      `Окна, двери, ворота, решетки`,
      `Отделочные материалы`,
      `Сантехника, водоснабжение`,
      `Стекло для строительства и отделки интерьеров`,
      `Тепло, звуко, изоляционные материалы`,
    ],
  },
  {
    name: `Тара и упаковка`,
    children: [
      `Бочки, бидоны, канистры, бутылки, прочие емкости`,
      `Бумага оберточная, крафт, пергаментная`,
      `Гильзы, тубусы, барабаны, футляры`,
      `Контейнеры, поддоны, ящики, мешки, пакеты`,
      `Транспортная тара и упаковка`,
      `Упаковочная лента, стретч-пленка, скотч, шпагат`,
    ],
  },
  {
    name: `Химическая продукция, сырье, изделия`,
    children: [
      `Асбестотехнические изделия`,
      `Буровые реагенты, буровая химия`,
      `Взрывчатые вещества`,
      `Катализаторы, адсорбенты, абсорбенты`,
      `Каучук, латекс, резиновые смеси, резинотехнические изделия`,
      `Клеи, клеевые компоненты, герметики`,
      `Лакокрасочные материалы`,
      `Неорганические вещества`,
      `Полимеры, смола, пластмассы`,
      `Полиэтилен, полипропилен, ПВХ`,
      `Промышленное сырье`,
      `Стеклопластик, стеклоткань, стекловолокно`,
      `Химреактивы, высокочистые вещества`,
      `Эфиры, спирты, воски, соли, оксиды`,
    ],
  },
  {
    name: `Электрооборудование`,
    children: [
      `Аккумуляторы и элементы питания`,
      `Кабели, привода, арматура, несущие системы`,
      `Лампы, прожекторы, фонари, светильники`,
      `Разъемы, соединители, адаптеры, переводники`,
      `Шкафы распределительные, пускорегулирующие аппараты`,
      `Электродвигатели, трансформаторы, электрогенераторы, стабилизаторы`,
      `Электроизоляционные материалы, изоляторы`,
      `Электростанции, электрощитовое оборудование`,
      `Электроустановочные и электромонтажные изделия`,
    ],
  },
];

export class CategoriesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const item of items) {
      const category = em.create(Category, {
        name: item.name,
      });

      item.children.forEach((name) => {
        em.create(Category, { name, parentCategory: category });
      });
    }
  }
}
