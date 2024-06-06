import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

// variable indiquant le nombre de prestation par page
const PER_PAGE = 9;

const EventList = () => {
  // récupération des données data{events: Array(18), focus: Array(3)} et error
  const { data, error } = useData();

  // variable du type de prestation sélectionné
  const [type, setType] = useState();

  // variable de la page en cours
  const [currentPage, setCurrentPage] = useState(1);

  console.log(type)
  const filteredEvents = (
    (!type
      ? data?.events
      : data?.events) || []
  ).filter((event, index) => {
    if (
      (currentPage - 1) * PER_PAGE <= index &&
      PER_PAGE * currentPage > index
    ) {
      return true;
    }
    return false;
  });

  // à chaque changement de type, on l'enregistre et réinitialise la page courante
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Nombre total de pages
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  // Liste des types d'événements
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
