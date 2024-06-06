import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  // récupération des données {events: Array(18), focus: Array(3)}
  const { data } = useData();

  // variable du numéro de la diapo
  const [index, setIndex] = useState(0);

  // classement des évenements par ordre décroissant
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  // change la diapo toutes les 5 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    // Nettoyage de l'intervalle
    return () => clearInterval(intervalId);
  }, [byDateDesc]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          {index === idx && (
            <div className="SlideCard__paginationContainer">
              <div className="SlideCard__pagination">
                {byDateDesc.map((_, radioIdx) => (
                  <input
                    key={`${_.id}`}
                    type="radio"
                    name="radio-button"
                    checked={idx === radioIdx}
                    readOnly
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default Slider;
