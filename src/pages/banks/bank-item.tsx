import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { Bank } from "../../interfaces/Bank";

export const BankItem: React.FC<Partial<Bank>> = (props:Partial<Bank>) => {

  const history = useHistory();

  const editBankItem = () => {
    history.push("/add-bank", {...props})
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{props.name}- xxx{props.lastDigits}</IonCardTitle>
        <IonCardSubtitle></IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {props.balance}
      </IonCardContent>
      <IonButton onClick={()=>editBankItem()}>Edit</IonButton>
    </IonCard>
  );
};
