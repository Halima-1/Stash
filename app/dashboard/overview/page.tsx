'use client';

import { ArrowLeftRightIcon, LockKeyhole, PlusIcon, TrendingUp } from 'lucide-react'
import { BsBank2 } from 'react-icons/bs'
import { FaArrowRightArrowLeft } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

const vaultCards = [
    {
        title: 'Flexible vault',
        tag: 'Auto compounding',
        balance: '535,000 USDC',
        firstLabel: 'Current Apy',
        firstValue: '4.5%',
        secondLabel: 'Withdrawal',
        secondValue: 'Instant',
        icon: <BsBank2 style={{ color: "#052321" }} size={14} />,
    },
    {
        title: 'Fixed vault',
        tag: '90 Days lock',
        balance: '15,000 USDC',
        firstLabel: 'Current Apy',
        firstValue: '4.5%',
        secondLabel: 'Next Unlock',
        secondValue: '12 days',
        icon: <LockKeyhole style={{ color: "#052321" }} size={14} />,
    },
    {
        title: 'Transfer rail',
        tag: 'Fast settlement',
        balance: '126 payouts',
        firstLabel: 'This week',
        firstValue: '18 sent',
        secondLabel: 'Settlement',
        secondValue: 'Near instant',
        icon: <ArrowLeftRightIcon style={{ color: "#052321" }} size={14} />,
    },
];

const Overview = () => {
    const router = useRouter()

    return (
        <section className='overview'>
            <div className="intro">
                <div className="overview-copy">
                    <h1>Institutional Overview</h1>
                    <p>Welcome back. With stash, Your assets are fully secured.</p>
                </div>
                <div className='btn'>
                    <button className='btn1'
                        onClick={() => { router.push('/dashboard/flexible') }
                        }
                    ><PlusIcon size={16} style={{ marginBottom: "-3px", marginRight: "6px" }} />Deposit</button>
                    <button className='btn2'
                        onClick={() => { router.push('/dashboard/transfer') }}
                    ><span><FaArrowRightArrowLeft size={16} style={{ marginBottom: "-3px", marginRight: "6px" }} /></span>Transfer</button>
                </div>
            </div>

            <div className="net">
                <div className="balCont">
                    <div className="balL">
                        <div className='bal'>
                            <b>Total Net worth</b>
                            <div className='totalBal'>
                                <h2>$10 </h2>
                                <span>USDC</span>
                            </div>
                        </div>
                        <span className='trend'><TrendingUp size={14} /> +4.2% (24h)</span>
                    </div>
                    <div className="chart"></div>
                </div>
                <div className='Ayield'>
                    <b>Accrued yield</b>
                    <h3>+$5432.57</h3>
                    <span style={{ fontSize: "14px", color: "#3e3d3d" }}>Yield gnerated this month</span>

                    <button className="yield-an">Yield Analytic</button>
                </div>
            </div>
            <div className="cont">
                <div className='flxb-cont'>
                    <div className='flex'>
                        <div>
                            <span><BsBank2 style={{ color: "#052321" }} size={14} /></span>
                            <p>Flexible vault</p>
                        </div>
                        <span style={{ color: "#052321", borderRadius: "20px", padding: "0 6px", backgroundColor: "rgba(8, 84, 78,0.3)" }}>Auto compounding</span>
                    </div>
                    {/* <div> */}
                    <span>Active balance</span>
                    <h2>535,000 USDC</h2>
                    <div className="apy">
                        <div>
                            <span>Current Apy</span>
                            <h2>4.5%</h2>
                        </div>
                        <div>
                            <span>Withdrawal</span>
                            <h2>Instant</h2>
                        </div>
                    </div>
                    {/* </div> */}
                </div>

                {/* fixed */}
                <div className='flxb-cont'>
                    <div className='flex'>
                        <div>
                            <span><LockKeyhole style={{ color: "#052321" }} size={14} /></span>
                            <p>Fixed vault</p>
                        </div>
                        <span style={{ color: "#052321", borderRadius: "20px", padding: "0 6px", backgroundColor: "rgba(8, 84, 78,0.3)" }}>90 Days lock</span>
                    </div>
                    {/* <div> */}
                    <span>Active balance</span>
                    <h2>15000 USDC</h2>
                    <div className="apy">
                        <div>
                            <span>Current Apy</span>
                            <h2>4.5%</h2>
                        </div>
                        <div>
                            <span>Next Unlock</span>
                            <h2>12 days</h2>
                        </div>
                    </div>
                    {/* </div> */}
                </div>

                <div className='flxb-cont'>

                </div>
                <div></div>

            </div>
        </section>
    )
}
export default Overview