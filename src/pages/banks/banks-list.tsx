import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { add, ban, } from "ionicons/icons";
import { BankItem } from "./bank-item";
import React, { useEffect, useState } from "react";
import { Bank } from "../../interfaces/Bank";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchAllBanks, updateReload } from "../../reducers/bankReducer";

export const BanksList: React.FC = () => {
  const router = useIonRouter();

  const pageTitle = "Bank Accounts";

  const bankStore = useAppSelector(state => state.bankStore)

  const [banks, setBanks] = useState<Bank[]|[]>(bankStore.banks)
  const [usableAmount, setUsableAmount] = useState<Number>(0);
  const [reservedAmount, setReservedAmount] = useState<Number>(0);
  
  const dispatch = useAppDispatch();

  useEffect(()=> {
    setBanks(bankStore.banks)
  }, [bankStore.banks])

  useEffect(() => {
    if (bankStore.reload) {
      dispatch(fetchAllBanks())
      dispatch(updateReload(false))
    }
  }, [bankStore.reload])

  useEffect(()=> {
    const { usableAmount, reservedAmount } = banks.reduce(
      (totals, account) => {
        if (account.isExpenseAccount) {
          totals.usableAmount += account.balance;
        } else {
          totals.reservedAmount += account.balance;
        }
        return totals;
      },
      { usableAmount: 0, reservedAmount: 0 } // Initial values
    );

    setUsableAmount(usableAmount)
    setReservedAmount(reservedAmount)
  }, [banks])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle size="large">{pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Usable Amount</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>{usableAmount.toString()}</IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Reserved Amount</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>{reservedAmount.toString()}</IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
          {banks?.map((bankAccount: Bank, key:number) => (
            <BankItem
              id={bankAccount.id}
              name={bankAccount.name}
              lastDigits={bankAccount.lastDigits}
              balance={bankAccount.balance}
              isExpenseAccount={bankAccount.isExpenseAccount}
              isActive={bankAccount.isActive}
              key={key}
            />
          ))}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => router.push("/add-bank")}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};
