import { useRouter } from 'next/router';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid';

export const Tabs = ({ className = '', children }) => {
  const router = useRouter();

  const handlePrev = () => {
    const activeIndex = children.findIndex(
      (child) => child.props.url === router.pathname
    );
    const newIndex = (activeIndex - 1 + children.length) % children.length;
    router.push(children[newIndex].props.url);
  };

  const handleNext = () => {
    let activeIndex = children.findIndex(
      (child) => child.props.url === router.pathname
    );
    const newIndex = (activeIndex + 1) % children.length;
    router.push(children[newIndex].props.url);
  };

  return (
    <div className={`flex self-stretch ${className}`}>
      <button
        className="bg-slate-900 text-slate-400 border-b-2 border-transparent hover:border-slate-400 py-2 px-6 rounded-tl-2xl flex flex-1 items-center justify-center"
        onClick={handlePrev}
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      {children}
      <button
        onClick={handleNext}
        className="bg-slate-900 text-slate-400 border-b-2 border-transparent hover:border-slate-400 py-2 px-6 rounded-tr-2xl flex flex-1 items-center justify-center"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
