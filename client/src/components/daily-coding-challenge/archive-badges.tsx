import React from 'react';
import { RibbonIcon } from '../../assets/icons/completion-ribbon';

import './archive-badges.css';

function ArchiveBadges(): JSX.Element {
  return (
    <>
      <p>Daily Challenges Completed: 5</p>
      <p>Daily Challenge Status: Kindling Coder</p>
      <RibbonIcon
        value={0}
        showNumbers={false}
        isCompleted={true}
        isClaimed={true}
      />
    </>
  );
}

ArchiveBadges.displayName = 'ArchiveBadges';

export default ArchiveBadges;
