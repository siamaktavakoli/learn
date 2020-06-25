import React, {useEffect, useState, useCallback} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import SVG from 'react-inlinesvg';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import Link from '@docusaurus/Link';

import SiteSearchAPIConnector from "@elastic/search-ui-site-search-connector";
import { SearchProvider, WithSearch, Results, SearchBox, ResultsPerPage } from "@elastic/react-search-ui";

// import "@elastic/react-search-ui-views/lib/styles/styles.css";
import styles from './styles.SearchBar.module.scss';

const connector = new SiteSearchAPIConnector({
  documentType: "page",
  engineKey: "BZL_aEiLAebVKkcm3eFr"
});

const SearchBar = (props) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const keyPressHandler = (e) => {
      // Open on typing `s`
      if (e.target.tagName === 'BODY' && e.key === 's' || e.key === '?') {
        e.preventDefault()
        onOpen()
      }

      // Close on `Escape`
      if (e.target.className.includes('searchInput') && e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false);
        document.body.classList.remove('search-open');
      }
    };

    document.addEventListener('keydown', keyPressHandler);
    return () => {
      document.removeEventListener('keydown', keyPressHandler);
    };
  }, []);

  const onOpen = () => {
    setIsOpen(true);
    document.body.classList.add('search-open');
  }

  const onClose = useCallback((evt) => {
    if (evt.target === evt.currentTarget || evt.currentTarget.tagName === 'A') {
      setIsOpen(false);
      document.body.classList.remove('search-open');
    }
  }, [setIsOpen]);

  return (
    <>
      <button
        className={styles.searchButton}
        onClick={onOpen}>
          Search Netdata...
          <span className={styles.searchKey}>?</span>
      </button>

      {isOpen &&
        createPortal(
          <div 
            className={clsx('searchClose', styles.searchContainer)}
            onClick={onClose}>
            <div onClick={null} className={styles.searchModal}>
              
              <SearchProvider
                config={{
                  apiConnector: connector
                }}
              >
                <WithSearch
                  mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
                    searchTerm,
                    setSearchTerm,
                    results
                  })}
                >
                  {({ searchTerm, setSearchTerm, results }) => {
                    return (
                      <>
                        <header className={styles.searchHeader}>
                          <input
                            className={clsx(styles.searchInput)}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search Netdata Learn..."
                            autoFocus
                          />
                          <div className={styles.resultVolume}>
                            <p>Your search returned {results.length} queries.</p>
                            <ResultsPerPage className={styles.resultPaged} />
                          </div>
                        </header>
                        <div className={styles.searchResults}>
                          {searchTerm !== '' && results.map(r => (
                            <div key={r.id.raw} className={clsx(styles.searchResultItem)}>
                              {(() => {
                                if (r.url.raw.includes('learn.netdata.cloud') == true) {
                                  return (
                                    <Link onClick={onClose} to={r.url.raw.split('https://learn.netdata.cloud')[1]}>
                                      <h3>{r.title.raw} <span className={clsx(styles.resultFlag)}>Learn / Docs</span></h3>
                                      <p className={clsx(styles.resultUrl)}>{r.url.raw}</p>
                                    </Link>
                                  )
                                } else if (r.url.raw.includes('netdata.cloud/blog') == true) {
                                  return (
                                    <Link href={r.url.raw}>
                                      <h3>{r.title.raw} <span className={clsx(styles.resultFlag)}>Blog</span></h3>
                                      <p className={clsx(styles.resultUrl)}>{r.url.raw}</p>
                                    </Link>
                                  )
                                } else if (r.url.raw.includes('netdata.cloud') == true) {
                                  return (
                                    <Link href={r.url.raw}>
                                      <h3>{r.title.raw} <span className={clsx(styles.resultFlag)}>Netdata.Cloud</span></h3>
                                      <p className={clsx(styles.resultUrl)}>{r.url.raw}</p>
                                    </Link>
                                  )
                                } else if (r.url.raw.includes('github.com') == true) {
                                  return (
                                    <Link href={r.url.raw}>
                                      <h3>{r.title.raw} <span className={clsx(styles.resultFlag)}>GitHub</span></h3>
                                      <p className={clsx(styles.resultUrl)}>{r.url.raw}</p>
                                    </Link>
                                  )
                                }
                              })()}
                            </div>
                          ))}
                        </div>
                        <footer className={styles.searchFooter}>
                          <div className={styles.closeInst}>
                            <div className={styles.closeKey}>
                              Press <code>Esc</code> to close
                            </div>
                            <div className={styles.closeButton}>
                              <button 
                                className={clsx('button button--secondary button--lg')} 
                                onClick={onClose}>
                                Close
                              </button>
                            </div>
                          </div>
                        </footer>
                      </>
                    );
                  }}
                </WithSearch>
              </SearchProvider>
              
            </div>  
          </div>,
          document.body,
        )
      }

    </>
  )
}

export default SearchBar; 
