import React from 'react';

function Degree(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
): JSX.Element {
  return (
    <>
      <svg
        height='469.970433'
        viewBox='9.86206897 10.02955732 620.27586207 469.97043266'
        width='620.275862'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          d='m-31.52709-31.52709h63.05419v63.05419h-63.05419z'
          fill='none'
          stroke='#0a0a23'
          stroke-width='5'
          transform='matrix(9.52 0 0 7.14 320 245.01)'
        />
        <g fill='#0a0a23'>
          <path
            d='m-31.52709-31.52709h63.05419v63.05419h-63.05419z'
            transform='matrix(8.25 0 0 1.11 320 95.14)'
          />
          <path
            d='m0 30.56 40-30.56 40 30.56-15.28 49.44h-49.44z'
            transform='matrix(1.73 0 0 1.73 410.8 180.66)'
          />
          <path
            d='m-65.44716-65.44716h130.89432v130.89432h-130.89432z'
            transform='matrix(1.99 0 0 .31 210 260)'
          />
          <path
            d='m-65.44716-65.44716h130.89432v130.89432h-130.89432z'
            transform='matrix(1.99 0 0 .31 209.76 340)'
          />
          <path
            d='m-20-44.58333-20 89.16667 40-20 40 20-20-89.16667z'
            stroke='#0a0a23'
            transform='matrix(1 0 0 1.03 480 363.8)'
          />
        </g>
      </svg>
    </>
  );
}

Degree.displayName = 'Degree';

export default Degree;
