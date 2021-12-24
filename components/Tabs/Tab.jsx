import Link from 'next/link';
import { useRouter } from 'next/router';

export const Tab = ({ className = '', children, disabled, url }) => {
  const router = useRouter();
  return (
    <Link href={url} passHref>
      <div
        className={`py-2 px-6 border-b-2 hover:border-slate-400 bg-slate-900 text-slate-400 ${className} ${
          url === router.pathname ? 'border-slate-400' : 'border-transparent'
        } ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}
      >
        {children}
      </div>
    </Link>
  );
};
