import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Dashboard.css';
import { useEffect, useState } from 'react';
import { Bank } from '../interfaces/Bank';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchAllBanks, updateReload } from '../reducers/bankReducer';
import { goToPage, logMsg } from '../utils/commons';
import { logoMedium } from 'ionicons/icons';

const Dashboard: React.FC = () => {

  const tabTitle = "Dashboard";
  const router = useIonRouter();

  const dispatch = useAppDispatch();
  const bankStore = useAppSelector(state => state.bankStore)

  const [banks, setBanks] = useState<Bank[]|[]>(bankStore.banks)
  const [usableAmount, setUsableAmount] = useState<Number>(0);
  const [reservedAmount, setReservedAmount] = useState<Number>(0);

  useEffect(() => {
    dispatch(fetchAllBanks())
  }, [])
  
  useEffect(()=> {
    setBanks(bankStore.banks)
  }, [bankStore.banks])

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

  useEffect(() => {
    if (bankStore.reload) {
      dispatch(fetchAllBanks())
      dispatch(updateReload(false))
    }
  }, [bankStore.reload])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{tabTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{tabTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Bank Accounts</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>{banks? banks.length : 0}</IonCardContent>
                <IonButton onClick={() => goToPage(router, "/banks")} fill="clear">View</IonButton>
                <IonButton onClick={() => goToPage(router, "/add-bank")} fill="clear">Add</IonButton>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Credit Cards</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>5</IonCardContent>
                <IonButton onClick={() => goToPage(router, "/credit-cards")} fill="clear">View</IonButton>
                <IonButton onClick={() => goToPage(router, "/add-creditCard")} fill="clear">Add</IonButton>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
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
        <IonGrid></IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
