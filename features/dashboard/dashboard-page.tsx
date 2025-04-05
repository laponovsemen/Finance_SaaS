import { useGetAccounts } from '@/accounts/api/use-get-accounts';


function DashboardBoard() {
    const { data: accounts, isLoading } = useGetAccounts();

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            {accounts?.map((account) => {

                return (
                    <div
                        key={account.id}
                    >
                        {account.name}
                    </div>
                )
            })}
        </div>
    );
}

export default DashboardBoard;