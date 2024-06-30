import React from "react";
import { ListGroup } from "react-bootstrap";
import { PetitionDto } from "../../api/petitions/petitionsModels";
import { Link } from "react-router-dom";
import Countdown, { zeroPad } from "react-countdown";
import "./PetitionList.css";

interface PetitionListProps {
  petitions: PetitionDto[];
}

const PetitionList: React.FC<PetitionListProps> = ({ petitions }) => {
  const renderCountdown = ({ days, hours, minutes, seconds }: any) => {
    return (
      <span>
        {days}д {zeroPad(hours)}г {zeroPad(minutes)}х {zeroPad(seconds)}с
      </span>
    );
  };

  return (
    <ListGroup>
      {petitions.map((petition) => (
        <ListGroup.Item
          key={petition.id}
          className="mb-3 shadow-sm rounded list-group-item-hover"
        >
          <Link
            to={`/petitions/edit/${petition.id}`}
            className="text-reset text-decoration-none stretched-link"
          >
            <h5>{petition.title}</h5>
            <p>{petition.description}</p>
            <div className="petition-meta">
              <span className="petition-author">
                Автор: {petition.createdByUser.email}
              </span>
              <span className="petition-signatures">
                Підписи: {petition.signatures.length}/
                {petition.requiredSignatures}
              </span>
              <span className="petition-expiration">
                {new Date(`${petition.expirationDate}Z`) < new Date() ? (
                  "Час вийшов"
                ) : (
                  <>
                    Залишилось:{" "}
                    <Countdown
                      date={new Date(`${petition.expirationDate}Z`)}
                      renderer={renderCountdown}
                    />
                  </>
                )}
              </span>
            </div>
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PetitionList;
